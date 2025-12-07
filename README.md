# GitGraph

**GitGraph** is a developer portfolio visualization tool that analyzes your GitHub activity in 2025 to generate a beautiful "Year in Code" recap. Powered by Google Gemini 2.5 Flash, it infers your skills, determines your developer archetype, and creates a shareable social media card.

## Features

-   **2025 Focus**: Specifically analyzes repositories updated in 2025.
-   **AI Analysis**: Uses Gemini 2.5 Flash to infer skills, languages, and frameworks even if not explicitly tagged.
-   **Developer Archetype**: Assigns a fun, descriptive "Vibe" or archetype to your coding style (e.g., "Shipping Velocity Specialist").
-   **Visualizations**:
    -   **Tech Stack Bar Chart**: Relative frequency of tools and languages.
    -   **Language Focus Pie Chart**: Distribution of primary languages.
-   **Shareable Card**: Generates a downloadable PNG card for Twitter/LinkedIn.
-   **Flat Aesthetic**: Clean, dark-mode design using Tailwind CSS.
-   **Vercel Analytics**: Built-in tracking for production metrics.

## Usage

1.  Visit [gitgraph.aibuilder.tools](https://gitgraph.aibuilder.tools).
2.  Enter a GitHub username (e.g., `torvalds`, `harishkotra`).
3.  Click **Analyze**.
4.  Wait for the AI to process your public repositories.
5.  View your dashboard and download your shareable card.

## Deployment on Vercel

This project is designed to be easily deployed on Vercel.

### Prerequisites
-   A Vercel Account
-   A Google Gemini API Key from Google AI Studio.

### Steps
1.  Push this code to a GitHub repository.
2.  Import the repository into Vercel.
3.  **Crucial Step**: In the Vercel "Configure Project" screen, go to **Environment Variables**.
4.  Add a new variable:
    -   **Key**: `API_KEY`
    -   **Value**: *Your Google Gemini API Key*
5.  Deploy.

*Note: If you are seeing a blank page in production, ensure your project is built correctly. If using the provided simple HTML structure, Vercel generally serves it as a static site. Ensure you haven't removed the script tags.*

## Development

This project is built with React, TypeScript, Tailwind CSS, and the Google GenAI SDK.

### Prerequisites

-   Node.js (v18+)
-   A Google Gemini API Key

### Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/gitgraph.git
    cd gitgraph
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory and add your API key:
    ```
    API_KEY=your_google_gemini_api_key
    ```
    *Note: The application uses `process.env.API_KEY` for the backend service.*

4.  **Run the development server**:
    ```bash
    npm start
    ```

## Contributing

Contributions are welcome!

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Credits

-   **Creator**: [Harish](https://x.com/harishkotra)
-   **Powered by**: Google Gemini API
-   **Hosting**: gitgraph.aibuilder.tools
