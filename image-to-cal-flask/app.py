import os
import base64
import uuid
from datetime import date
from flask import Flask, request, jsonify, send_file
from openai import OpenAI
from flask_cors import CORS

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": [
  "http://127.0.0.1:3000",
  "https://ai-image-to-cal.vercel.app",
  "https://ai-image-to-cal-git-new-tab-henrygreenhuts-projects.vercel.app",
]}})

os.makedirs("ics_files", exist_ok=True)

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def get_current_date():
    today = date.today()
    return today.strftime("%Y-%m-%d")

def generate_text_schedule(base64_image):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "This is a college student's schedule. "
                            "Extract all relevant information from it, "
                            "particularly the titles and times of each class. "
                            "Respond with the information of each class."
                        ),
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
                    },
                ],
            }
        ],
    )
    return response

def generate_ics(text_schedule):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an assistant that only outputs valid ICS files."
                    "Output in iCalendar format, nothing else. "
                    "Use MWF/TTh in BYDAY when possible & ensure DTSTART is the earliest"
                    f"day the event happens. Start at {get_current_date()}."
                    "End on 2026-06-01."
                    "Timezone: America/New_York."
                    "If there is additional info, add it to the event DESCRIPTION, but do NOT invent info and do NOT add a placeholder location."
                )
            },
            {
                "role": "user",
                "content": (
                    f"This is a college student's schedule. Convert it into an ics file: {text_schedule}"
                )
            }
        ]
    )
    return response

@app.route('/api/upload', methods=['POST'])
def upload_screenshot():
    file = request.files.get('screenshot')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    temp_path = "temp_screenshot.png"
    file.save(temp_path)

    try:
        base64_image = encode_image(temp_path)
        text_schedule_response = generate_text_schedule(base64_image)
        text_schedule = text_schedule_response.choices[0].message.content
        ics_response = generate_ics(text_schedule)
        ics_content = ics_response.choices[0].message.content
        filename = f"{uuid.uuid4()}.ics"
        ics_path = os.path.join("ics_files", filename)
        with open(ics_path, "w") as f:
            f.write(ics_content)
        ics_url = f"https://ai-image-to-cal-production.up.railway.app/api/download_ics/{filename}"
        return jsonify({"icsURL": ics_url})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.route('/api/download_ics/<filename>', methods=['GET'])
def download_ics(filename):
    ics_path = os.path.join("ics_files", filename)
    if not os.path.exists(ics_path):
        return jsonify({"error": "ICS file not found"}), 404

    return send_file(ics_path, as_attachment=True, download_name="my_schedule.ics", mimetype="text/calendar")

@app.route('/health')
def health_check():
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)