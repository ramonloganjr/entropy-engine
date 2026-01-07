"""
The Entropy Engine - Backend Application
A statistical lottery combination filtering system
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import generate, scanner

app = FastAPI(
    title="The Entropy Engine",
    description="Lottery combination optimization through statistical filtering",
    version="1.0.0"
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(generate.router, prefix="/api", tags=["Generation"])
app.include_router(scanner.router, prefix="/api", tags=["Scanner"])


@app.get("/")
async def root():
    return {
        "name": "The Entropy Engine",
        "status": "operational",
        "disclaimer": "This application is for entertainment purposes only. "
                      "No filtering system can improve actual lottery odds."
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
