const fs = require('fs');
const path = require('path');

const readmePath = path.join(__dirname, 'README.md');
const markdown = fs.readFileSync(readmePath, 'utf-8');

const faqData = [
    {
        question: "How do I submit a new resource?",
        answer: `To submit a new resource to the Awesome Flux AI list, please follow these steps:
            <ol class="list-decimal list-inside space-y-2">
                <li>Ensure your resource is related to Flux AI technology.</li>
                <li>Fork the <a href="https://github.com/AINativeLab/awesome-flux-ai" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">GitHub repository</a>.</li>
                <li>Add your resource to the appropriate section in the README.md file.</li>
                <li>Create a Pull Request (PR) with a clear description of your addition.</li>
                <li>Wait for the maintainers to review and merge your PR.</li>
            </ol>
            <p class="mt-2">We appreciate your contributions to the Flux AI community!</p>`
    },
    {
        question: "What is Flux AI?",
        answer: "Flux AI is a suite of open-source text-to-image AI models developed by Black Forest Labs. It aims to advance state-of-the-art generative deep learning models for media, pushing the boundaries of creativity, efficiency, and diversity."
    },
    {
        question: "How can I use Flux AI models?",
        answer: "Flux AI models can be used through various platforms and APIs. Some models are available for commercial use, while others are for development purposes only. Check the specific model's license and usage instructions before implementing. You can find links to different Flux AI models and applications in the resources listed above."
    },
    {
        question: "How often is this list updated?",
        answer: "This list is updated regularly as new resources and tools become available. Community contributions play a significant role in keeping the list up-to-date. If you notice any outdated information or have a new resource to add, feel free to submit an update via a Pull Request to the GitHub repository. The frequency of updates may vary depending on the pace of developments in the Flux AI ecosystem."
    }
];

function parseMarkdown(md) {
    const sections = md.split('\n## ').slice(1);
    return sections.map(section => {
        const [title, ...content] = section.split('\n');
        const links = content
            .filter(line => line.trim().startsWith('-'))
            .map(line => {
                const match = line.match(/\[(.+)\]\((.+)\)/);
                return match ? { title: match[1], url: match[2] } : null;
            })
            .filter(Boolean);
        return { title, content: content.join('\n'), links };
    }).filter(section => {
      console.log(section)
      return section.title !== 'Online Demos'
    })
}

function truncateString(str, num) {
    if (str.length <= num) {
        return str;
    }
    return str.slice(0, num) + '...';
}

function createCard(link) {
    const domain = new URL(link.url).hostname;
    const truncatedTitle = truncateString(link.title, 30);
    return `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="bg-white rounded-lg shadow-sm p-4 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
            <div class="flex items-start mb-2">
                <img src="https://favicon.im/${domain}?larger=true" alt="Icon" class="w-12 h-12 mr-3 rounded">
                <div class="flex-grow">
                    <h3 class="text-lg font-semibold" title="${link.title}">${truncatedTitle}</h3>
                    <span class="inline-block text-gray-500 text-xs">${domain}</span>
                </div>
            </div>
            <!--<p class="text-sm text-gray-600 mt-2 flex-grow">Explore Flux AI resources and tools.</p>-->
        </a>
    `;
}

function createFAQSection(faqData) {
    return `
        <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 class="text-2xl font-bold mb-6">FAQ</h2>
            ${faqData.map((item, index) => `
                <div class="mb-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <button class="faq-question text-left w-full flex justify-between items-center py-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200" onclick="toggleAnswer(${index})">
                        <span class="font-semibold text-gray-800">${item.question}</span>
                        <svg class="w-5 h-5 transform transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <div class="faq-answer px-4 text-gray-700" id="faq-answer-${index}">
                        ${item.answer}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function generateHTML(parsedSections) {
    let content = '';

    parsedSections.forEach(section => {
        if (section.links.length > 0) {
            content += `
                <div class="mb-8">
                    <h2 class="text-2xl font-bold mb-4">${section.title}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${section.links.map(link => createCard(link)).join('')}
                    </div>
                </div>
            `;
        }
    });

    content += createFAQSection(faqData);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Awesome Flux AI Resources</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out, padding 0.3s ease-out, opacity 0.3s ease-out;
            opacity: 0;
        }
        .faq-answer.active {
            max-height: 1000px;
            padding-top: 1rem;
            padding-bottom: 1rem;
            opacity: 1;
        }
    </style>
    <script defer data-domain="awesomefluxai.com" src="https://click.pageview.click/js/script.js"></script>
</head>
<body class="bg-gray-100 font-sans flex flex-col min-h-screen">
    <header class="bg-white shadow-sm">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold">Awesome <span class="text-blue-600">Flux AI</span> Resources</h1>
                <p class="mt-2 text-gray-600">A curated list of awesome resources for Flux AI technology</p>
            </div>
            <a href="https://github.com/AINativeLab/awesome-flux-ai" target="_blank" rel="noopener noreferrer" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Submit
            </a>
        </div>
    </header>

    <main class="container mx-auto px-6 py-8 flex-grow" id="main-content">
        ${content}
    </main>

    <footer class="bg-white shadow-sm">
        <div class="container mx-auto px-6 py-4 flex justify-center items-center">
            <a href="https://github.com/AINativeLab/awesome-flux-ai" target="_blank" rel="noopener noreferrer" class="flex items-center text-gray-600 hover:text-gray-900">
                <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.164 22 16.42 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
                GitHub Repository
            </a>
        </div>
    </footer>

    <script>
        function toggleAnswer(index) {
            const answer = document.getElementById(\`faq-answer-\${index}\`);
            const button = answer.previousElementSibling;
            const icon = button.querySelector('svg');
            
            answer.classList.toggle('active');
            icon.classList.toggle('rotate-180');
        }
    </script>
</body>
</html>
    `;
}

const parsedSections = parseMarkdown(markdown);
const html = generateHTML(parsedSections);

const outputPath = path.join(__dirname, 'index.html');
fs.writeFileSync(outputPath, html);

console.log('HTML file generated successfully!');