import os
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from dotenv import load_dotenv

load_dotenv()

class Chain:
    def __init__(self):
        self.llm = ChatGroq(temperature=0, groq_api_key=os.getenv("GROQ_API_KEY"), model_name="llama-3.3-70b-versatile")

    def extract_jobs(self, cleaned_text):
        prompt_extract = PromptTemplate.from_template(
            """
            ### SCRAPED TEXT FROM WEBSITE:
            {page_data}
            ### INSTRUCTION:
            The scraped text is from the career's page of a website.
            Your job is to extract the job postings and return them in JSON format containing the following keys: `role`, `experience`, `skills` and `description`.
            
            Guidelines:
            - **Role**: The exact job title (e.g. "Senior Full Stack Engineer").
            - **Experience**: Years of experience required (e.g. "5+ years"). If not specified, infer from level (Senior=5+, Junior=0-2).
            - **Skills**: Extract key technical stack (e.g. React, Python, AWS) and soft skills.
            - **Description**: A concise summary of the KEY responsibilities and pain points this role solves.
            
            Only return the valid JSON.
            ### VALID JSON (NO PREAMBLE):
            """
        )
        chain_extract = prompt_extract | self.llm
        res = chain_extract.invoke(input={"page_data": cleaned_text})
        try:
            json_parser = JsonOutputParser()
            res = json_parser.parse(res.content)
        except OutputParserException:
            raise OutputParserException("Context too big. Unable to parse jobs.")
        return res if isinstance(res, list) else [res]

    def write_mail(self, job, links):
        prompt_email = PromptTemplate.from_template(
            """
            ### JOB DESCRIPTION:
            {job_description}

            ### INSTRUCTION:
            You are Ashish, a Business Development Executive at **PitchKraft**. 
            PitchKraft is a premium AI & Software Automation agency that helps companies scale their engineering velocity and reduce operational costs.
            
            Your goal is to write a high-converting cold email to the hiring manager for the role described above.
            
            ### EMAIL GUIDELINES (Use the AIDA Framework):
            1.  **Subject Line**: Create a catchy, relevant subject line (e.g., "Regarding your [Role] search").
            2.  **Hook (Attention)**: Acknowledge their need for a {job[role]} and mention a specific pain point from the description.
            3.  **Value Prop (Interest)**: Explain how PitchKraft can solve this *faster* and *better* than a traditional hire. We don't just write code; we build automated systems.
            4.  **Portfolio (Desire)**: Seamlessly weave in the following case studies to prove capability: {link_list}
            5.  **Call to Action**: Ask for a brief 15-minute chat to discuss how we can contribute immediately.
            
            **Tone**: Professional, confident, yet conversational. Not "salesy".
            **Formatting**: Use short paragraphs. No generic fluff.
            
            ### EMAIL (NO PREAMBLE):
            """
        )
        chain_email = prompt_email | self.llm
        res = chain_email.invoke({"job_description": str(job), "link_list": links})
        return res.content

if __name__ == "__main__":
    print(os.getenv("GROQ_API_KEY"))