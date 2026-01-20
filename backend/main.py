
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.chains import Chain
from backend.portfolio import Portfolio
from backend.utils import clean_text
from langchain_community.document_loaders import WebBaseLoader

app = FastAPI()

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chain = Chain()
portfolio = Portfolio()
portfolio.load_portfolio()

class Request(BaseModel):
    url: str

@app.post("/generate")
async def generate(request: Request):
    try:
        loader = WebBaseLoader([request.url])
        docs = loader.load()
        if not docs:
            raise HTTPException(status_code=404, detail="No content found")
            
        data = clean_text(docs.pop().page_content)
        jobs = chain.extract_jobs(data)
        
        results = []
        for job in jobs:
            skills = job.get('skills', [])
            links = portfolio.query_links(skills)
            email = chain.write_mail(job, links)
            results.append({"job": job, "links": links, "email": email})
            
        return {"results": results}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
