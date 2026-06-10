# AI Educational Assistant 🎓

An advanced, interactive educational platform designed exclusively for Class 5–12, JEE, and NEET preparation. Powered by an intelligent AI agent, this application acts as an Expert Subject Matter Scholar, dynamically generating in-depth, highly visual, and highly structured academic lessons on any educational topic.

## 🌟 Key Features

*   **Deep Academic Analysis**: Generates continuous, logically structured, multi-paragraph essays with no filler or fluff. Explains the "why" and "how" of complex concepts.
*   **Curated Visual Engine**: Automatically fetches high-resolution, logo-free, academic vector diagrams and charts exclusively from Wikimedia Commons. Automatically rejects generic real-life photos in favor of pure scientific illustrations.
*   **Fascinating Facts**: Extracts mind-blowing, highly engaging facts about every topic to keep students hooked.
*   **Real-World Impact**: Connects theoretical concepts to real-world applications across Healthcare, Technology, Science, Industry, and Daily Life.
*   **Practice & Review**: Automatically builds "Quick Review Notes" and generates custom, tiered practice questions (Warm-up, Challenge, Expert) for active recall.
*   **Automated Web Resources**: Intelligently curates links to trusted platforms like Vedantu, NCERT, Khan Academy, and Wikipedia, along with targeted YouTube video lecture search queries.
*   **Beautiful UI**: A highly polished, responsive, glassmorphism-inspired React dashboard featuring dynamic animations, elegant typography, and a distraction-free reader mode.

## 🚀 Technology Stack

*   **Frontend**: React (Vite), plain CSS (Glassmorphism & Modern UI)
*   **Icons**: Lucide React
*   **AI Engine**: GitHub Models (Azure AI Inference `gpt-4o`)
*   **Image Pipeline**: Wikipedia API (`generator=search`, `pageimages`)

## 🛠️ Setup & Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/kapil108/AI_Educational_Assistant.git
    cd AI_Educational_Assistant
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Development Server**
    ```bash
    npm run dev
    ```

4.  **Configure API Key**
    *   Once the app loads, click on the **API Configuration** button in the top left.
    *   Paste your **GitHub Personal Access Token** (Ensure the token has the `models` or `models:read` permission enabled).

## 🧠 AI Prompt Architecture

This application utilizes a strict, highly engineered `MASTER_PROMPT` to enforce academic rigor. The AI is hardcoded to:
*   Reject any non-academic queries.
*   Use 3 subheadings and heavy bolding for instantly scannable texts.
*   Output strictly in a complex nested JSON schema (`context`, `refs`, `img_prompt`, `important_facts`, etc.).
*   Prioritize CBSE/NCERT curriculum alignment.
