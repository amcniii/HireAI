import os
import json
import httpx
import re
from dotenv import load_dotenv

load_dotenv()

HF_MODELS = [
    "Qwen/Qwen2.5-72B-Instruct:fastest",
    "meta-llama/Llama-3.1-8B-Instruct:fastest",
    "meta-llama/Llama-3.2-3B-Instruct:fastest"
]

def analyze_resume_with_hf(resume_text: str, job_description: str) -> dict:
    hf_token = os.getenv("HF_TOKEN") or os.getenv("HF_API_KEY")
    if not hf_token:
        print("[HUGGINGFACE] HF_TOKEN not found in environment.")
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

    headers = {
        "Authorization": f"Bearer {hf_token}",
        "Content-Type": "application/json"
    }
    
    url = "https://router.huggingface.co/v1/chat/completions"
    
    for model_name in HF_MODELS:
        payload = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that outputs only raw JSON matching the requested schema. No markdown formatting, no backticks, no comments."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 1000
        }
        
        try:
            print(f"[HUGGINGFACE] Attempting analysis using model: {model_name}")
            response = httpx.post(url, json=payload, headers=headers, timeout=45.0)
            
            if response.status_code == 200:
                result_json = response.json()
                choices = result_json.get("choices", [])
                if choices:
                    text_response = choices[0].get("message", {}).get("content", "").strip()
                    
                    text_response = re.sub(r"^```(?:json)?\s*", "", text_response)
                    text_response = re.sub(r"\s*```$", "", text_response)
                    text_response = text_response.strip()
                    
                    try:
                        parsed_data = json.loads(text_response)
                        required_fields = ["name", "email", "phone", "skills", "education", "companies", "experience_years", "ai_summary"]
                        for field in required_fields:
                            if field not in parsed_data:
                                parsed_data[field] = None if field != "skills" and field != "education" and field != "companies" else []
                        
                        print(f"[HUGGINGFACE] Successfully parsed candidate: {parsed_data.get('name')}")
                        return parsed_data
                    except json.JSONDecodeError:
                        print(f"[HUGGINGFACE] Failed to parse JSON response from {model_name}. Response text: {text_response}")
            else:
                print(f"[HUGGINGFACE] Model {model_name} returned status code {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[HUGGINGFACE] Error occurred while calling {model_name}: {e}")
            
    return None
