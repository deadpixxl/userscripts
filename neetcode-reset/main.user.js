// ==UserScript==
// @name        Neetcode Reset
// @namespace   neetcode-reset.felixpackard.dev
// @match       *://neetcode.io/*
// @grant       none
// @version     1.0
// @author      felixpackard
// @description Adds a button to neetcode.io to reset the solution before opening the problem, in order to be able to revise previously completed problems without spoiling the solution for yourself.
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// ==/UserScript==

function updateRow(row) {
    // Get the problem slug
    const cell = row.querySelector("td:nth-of-type(3)");
    const href = cell.querySelector("a").getAttribute("href");
    const slug = href.split("/").pop();

    // Create reset button
    function reset() {
        if (!confirm("Are you sure you want to reset the code?")) return;
        for (const key in localStorage) {
            if (key.indexOf(slug) == 0) {
                localStorage.removeItem(key);
            }
        }
    }

    const td = row.querySelector("td:last-of-type").cloneNode(true);
    const anchor = td.querySelector("a");

    const button = document.createElement("button");
    for (const attr of anchor.attributes) {
        button.setAttribute(attr.name, attr.value);
    }

    button.appendChild(anchor.firstChild);
    button.removeAttribute("href");
    button.addEventListener("click", reset);

    // Update icon
    const icon = `<svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="undo" class="svg-inline--fa fa-undo fa-w-16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M212.333 224.333H12c-6.627 0-12-5.373-12-12V12C0 5.373 5.373 0 12 0h48c6.627 0 12 5.373 12 12v78.112C117.773 39.279 184.26 7.47 258.175 8.007c136.906.994 246.448 111.623 246.157 248.532C504.041 393.258 393.12 504 256.333 504c-64.089 0-122.496-24.313-166.51-64.215-5.099-4.622-5.334-12.554-.467-17.42l33.967-33.967c4.474-4.474 11.662-4.717 16.401-.525C170.76 415.336 211.58 432 256.333 432c97.268 0 176-78.716 176-176 0-97.267-78.716-176-176-176-58.496 0-110.28 28.476-142.274 72.333h98.274c6.627 0 12 5.373 12 12v48c0 6.627-5.373 12-12 12z"></path></svg>`;
    button.querySelector("svg").outerHTML = icon;

    anchor.replaceWith(button);
    row.appendChild(td);
}

function updateTable(table) {
    if (!table) return;

    // Don't modify tables that have already been modified
    if (table.hasAttribute("reset-column-added")) return;

    // Get heading row
    const tr = table.querySelector("table > thead > tr");
    if (!tr) return;

    // Create new heading
    const heading = tr.querySelector("th:last-of-type").cloneNode(true);
    heading.firstChild.textContent = "Reset";
    tr.appendChild(heading);

    // Update rows
    const rows = table.querySelectorAll("tbody > tr");
    for (const row of rows) {
        updateRow(row);
    }

    // Mark table as modified so we don't try to update it again
    table.setAttribute("reset-column-added", "true");
}

const _disconnect = VM.observe(document.body, () => {
    // Find the target node
    const tables = document.querySelectorAll("app-table");
    for (const table of tables) {
        updateTable(table);
    }
});
