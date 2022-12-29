import { createClient } from '@supabase/supabase-js';

export async function searchArticles(query) {
    const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

    const { data, error } = await db.from('articles')
    .select()
    .textSearch('fts', `%${query}%`)
    .order('id', { ascending: false })
    .limit(10);

    return { data, error};
  }

export async function handleSearchArticles() {
  const query = document.getElementById("search-bar").value;
  const searchResults = await searchArticles(query);

  if (searchResults.error) {
    displayEmptyMessage("An error occurred while searching for articles.");
  } else if (searchResults.data.length === 0) {
    displayEmptyMessage("No articles were found matching the search criteria.");
  } else {
    localStorage.setItem("articles", JSON.stringify(searchResults.data));
    loadContent();
  }
};

function loadContent() {
  let data = JSON.parse(localStorage.getItem("articles"));

  if (data) {
    const searchResultsElement = document.getElementById("search-results");
    if (searchResultsElement) {
      searchResultsElement.innerHTML = "";
      data.forEach(result => {
        searchResultsElement.innerHTML += generateArticleHTML(result);
      });
      generateListenersForButtons();
    }
  }
}
 
function codeGenerateId() {
  const randomNumber = Math.random();

  return 'code-' + randomNumber.toString();
}

function copyCode(id) {
  const element = document.getElementById(id);
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
}

export function displayEmptyMessage(message) {
  const searchResultsElement = document.getElementById("search-results");
  if (searchResultsElement) {
    searchResultsElement.innerHTML = "";
    searchResultsElement.innerHTML = `<div class="w-full bg-white rounded-lg shadow-md mb-4 p-4 text-center"><h2 class="text-lg font-bold text-gray-900">${message}</h2><p class="text-gray-600 text-sm mb-4">Please try again with a different search term.</p></div>`;
  }
}

function generateListenersForButtons() {
  const buttons = document.querySelectorAll('.copyCode');
  if (buttons) {
    buttons.forEach(elm => {
      elm.addEventListener('click', event => {
        const codeElementId = event.target.getAttribute('data-id');
        if (codeElementId) {
          copyCode(codeElementId);
        }
      });
    });
  }
}
  
function generateArticleHTML(result) {
  let bodyContent = "";
  bodyContent += `<div class="w-full bg-white rounded-lg shadow-md mb-4 p-4">
    <h2 class="text-xl font-bold text-gray-900">${result.title}</h2>
    <p class="text-gray-600 text-sm mb-4">${result.description}</p>`;

    if (result.code) {
      const codeLines = result.code.split("\n\n");
      
      codeLines.forEach(line => {
        const codeElementId = codeGenerateId();

        bodyContent += `
          <div class="relative col-span-3 bg-slate-800 rounded shadow mt-2">
            <div class="relative flex text-slate-400 text-xs leading-4">
                <div class="mt-2 flex-none text-sky-300 border-t border-b border-t-transparent border-b-sky-300 px-4 py-1 flex items-center">Code</div>
                <div class="flex-auto flex pt-2 rounded-tr-xl overflow-hidden">
                    <div class="flex-auto -mr-px bg-slate-700/50 border border-slate-500/30 rounded-tl"></div>
                </div>
        
                <div class="absolute top-2 right-0 h-8 flex items-center pr-4 -mt-1">
                    <div class="relative flex -mr-2">
                        <button type="button" class="copyCode text-slate-500 hover:text-slate-400">
                            <svg data-id="${codeElementId}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="w-8 h-8">
                                <path data-id="${codeElementId}" d="M13 10.75h-1.25a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H19"></path>
                                <path data-id="${codeElementId}" d="M18 12.25h-4a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM13.75 16.25h4.5M13.75 19.25h4.5"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="relative">
              <pre class="text-sm text-slate-50 flex ligatures-none overflow-auto">
                <code class="flex-none min-w-full pl-5">
                  <span class="flex">
                      <svg viewBox="0 -9 3 24" aria-hidden="true" class="flex-none overflow-visible text-pink-400 w-auto h-6 mr-3 -mt-1">
                          <path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                      <span class="flex-auto" id="${codeElementId}">${line.trimStart()}</span>
                  </span>
                </code>
              </pre>
            </div>
          </div>`
      });
    }
    bodyContent += `</div>`;

    return bodyContent;
}  

document.addEventListener('DOMContentLoaded', function() {
  loadContent();

  const searchInput = document.getElementById("search-bar");
  if (searchInput) {
    searchInput.addEventListener("keydown",  async (event) => {
      if (event.key === 'Enter') {
        handleSearchArticles();
      }
    });
  }

 
  
});


