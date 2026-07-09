import os
import json
import httpx
import re
from dotenv import load_dotenv

load_dotenv()

GEMINI_MODELS = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-3.5-flash"
]

def analyze_resume_with_gemini(resume_text: str, job_description: str) -> dict:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("[GEMINI] API key not found. Falling back to local parser.")
        return None

    prompt = f"""You are an expert ATS (Applicant Tracking System) parser. Parse the following candidate resume text and match it against the job description.

Job Description:
{job_description}

Candidate Resume Text:
{resume_text}

Extract the following information and return ONLY a valid JSON object matching this schema. Do not include any markdown backticks or extra text, just raw JSON:
{{
  "name": "Candidate Full Name or null",
  "email": "Candidate Email or null",
  "phone": "Candidate Phone or null",
  "skills": ["Skill1", "Skill2", ...],
  "education": [
    {{"degree": "Degree/Major name (do not include dates)", "school": "University/School name"}}
  ],
  "companies": [
    {{"role": "Job role title", "company": "Company name"}}
  ],
  "experience_years": 0.0, // Float. Calculate total professional work experience in years. Exclude academic/education study years. 1 month = 0.08. If none, return 0.0.
  "ai_summary": "A concise, professional summary highlighting why this candidate is a good or bad fit for the job description based on their credentials."
}}"""

    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }

    headers = {
        "Content-Type": "application/json"
    }

    for model_name in GEMINI_MODELS:
        url = f"https://generativelanguage.googleapis.com/v1/models/{model_name}:generateContent?key={api_key}"
        try:
            print(f"[GEMINI] Attempting analysis using model: {model_name}")
            response = httpx.post(url, json=payload, headers=headers, timeout=30.0)
            
            if response.status_code == 200:
                result_json = response.json()
                candidates = result_json.get("candidates", [])
                if candidates:
                    content = candidates[0].get("content", {})
                    parts = content.get("parts", [])
                    if parts:
                        text_response = parts[0].get("text", "").strip()
                        
                        text_response = re.sub(r"^```(?:json)?\s*", "", text_response)
                        text_response = re.sub(r"\s*```$", "", text_response)
                        text_response = text_response.strip()
                        
                        try:
                            parsed_data = json.loads(text_response)
                            required_fields = ["name", "email", "phone", "skills", "education", "companies", "experience_years", "ai_summary"]
                            for field in required_fields:
                                if field not in parsed_data:
                                    parsed_data[field] = None if field != "skills" and field != "education" and field != "companies" else []
                            
                            print(f"[GEMINI] Successfully parsed candidate: {parsed_data.get('name')}")
                            return parsed_data
                        except json.JSONDecodeError:
                            print(f"[GEMINI] Failed to parse JSON response from {model_name}. Response text: {text_response}")
            elif response.status_code == 429:
                print(f"[GEMINI] Model {model_name} rate limited (HTTP 429). Trying next fallback model.")
            else:
                print(f"[GEMINI] Model {model_name} returned status code {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[GEMINI] Error occurred while calling {model_name}: {e}")

    print("[GEMINI] All model attempts exhausted or failed.")
    return None
