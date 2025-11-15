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
        prompt = (
            "Summarize the following text in HTML format with headings and bullet points:\n\n"
            f"{text}\n\n"
            "Summary:"
        )
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes text."},
                {"role": "user", "content": f"Please summarize '{patient_record}' in this certain style: '{prompt}'"}
            ],
            max_tokens=1000,
            temperature=0.7,
        )
        summary = response.choices[0].message.content
        return summary
    

if __name__ == "__main__":
    summarizer = Summarizer()