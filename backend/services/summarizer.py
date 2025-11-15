"""
- get data from DB
- process using OpenAI
  - prompt: summarize text in html format with headings and bullet points

"""
import openai

from backend.utils import load_config


class Summarizer:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=load_config("config.yaml").get("openai_key"))

    def summarize(self, text: str, patient_record: str) -> str:
        system_prompt = (
            "You will be provided with the self-reported symptoms of a patient.\n\n"
            "Each entry has a date and the transcribed text of their recording.\n\n"
            "Summarize the following text in HTML format with headings and bullet points:\n\n"
            "Make consecutive headings smaller.\n\n"
            "DO NOT respond with anything else other than HTML.\n\n"
            f"{text}\n\n"
            "Summary:"
        )
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": f"{system_prompt}"},
                {"role": "user", "content": f"Please summarize '{patient_record}'"}
            ],
            max_tokens=1000,
            temperature=0.7,
        )
        summary = response.choices[0].message.content
        return summary
    

if __name__ == "__main__":
    summarizer = Summarizer()