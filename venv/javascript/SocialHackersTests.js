/*
    Example Javascript file for use with SocialHackersTests
    Author: Paul Cleverley
*/
var GitHubPath = "https://api.github.com"
var SocialHackersAcademyRepos = "/orgs/SocialHackersCodeSchool/repos"
var SocialHackersAcademySearch = "/repos/SocialHackersCodeSchool/"

function youClickedMe()
{
    console.log("You clicked me");
    retrieveFromGitHub();
}
function showMessage(message)
{
    document.getElementById("messageBox").innerHTML = message;
}

function clearMessage()
{
    showMessage("");
}

function retrieveFromGitHub()
{
    //retrieve repos list
    var url = GitHubPath + SocialHackersAcademyRepos

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            tableRepos = document.getElementById("tblRepos");
            tableRepos.innerHTML = "<div></div>";
            headerRow = document.createElement("div");
            headerName= document.createElement("div");
            headerCont= document.createElement("div");
            headerRow.className = "rowRepos";
            headerName.className = "headerRepos";
            headerName.appendChild(document.createTextNode("Repository"));
            headerCont.className = "headerRepos";
            headerCont.appendChild(document.createTextNode("Contributors"));

            headerRow.appendChild(headerName);
            headerRow.appendChild(headerCont);
            tableRepos.appendChild(headerRow);

            var json = JSON.parse(this.responseText);
            for (var i = 0, len = json.length; i < len; ++i)
            {
                item = json[i];
                name = item.name;
                contributors_url = item.contributors_url;

                row = document.createElement("div");
                row.className = "rowRepos";
                nameCell = document.createElement("div");
                nameCell.className="cellRepos";
                link = makeLink(item.svn_url, name);
                nameCell.appendChild(link)

                contributorsCell = document.createElement("div");
                contributorsCell.className="cellRepos";

                getContributors(contributors_url, contributorsCell)

                row.appendChild(nameCell);
                row.appendChild(contributorsCell);
                tableRepos.appendChild(row)
            }
        }
        else if (this.status == 404)
        {
            tableRepos = document.getElementById("tblRepos");
            tableRepos.innerHTML = "";
            json = JSON.parse(this.responseText);
            showMessage(json.message)
        }
        else if (this.status == 403)
        {
            showMessage(this.statusText);
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}
function makeLink(url, content)
{
  link = document.createElement("a")
  link.href =  url;
  link.target = "_blank";
  link.innerHTML = content;
  return link
}

function getContributors(url, cell)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            cell.innerHTML = "";
            var json = JSON.parse(this.responseText);
            contributors = []
            for (var i = 0, len = json.length; i < len; ++i)
            {
                contributors.push(json[i].login);
            }
            cell.innerHTML = contributors.join().replace(/,/g, ', ');
        }
        else if (this.status == 404)
        {
            cell.innerHTML('No contributors found');
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

function searchSocialHackersAcademyRepos(searchTerm)
{
    //perform search
    var url = GitHubPath + SocialHackersAcademySearch + searchTerm;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            json = JSON.parse(this.responseText);
            searchResults = document.getElementById("searchResults");
            searchResults.innerHTML = "";
            searchResults.appendChild(formatSearchResults(json));
        }
        else if (this.status == 404)
        {
            searchResults = document.getElementById("searchResults");
            searchResults.innerHTML = "No results found - please try a different search term";
        }
    };

    clearMessage();
    xhttp.open("GET", url, true);
    xhttp.send();
}

function formatSearchResults(json)
{
    //return HTML formatted json search results
    tableSearchResults = document.createElement("table");
    with (tableSearchResults)
    {
        setAttribute("id", "tblSearchResults");
        svn_url = makeLink(json.svn_url, json.name);
        appendChild(createSearchRow("Repository", svn_url));
        appendChild(createSearchRow("Owner", json.owner.login));
        appendChild(createSearchRow("Subscribers", json.subscribers_count));
        appendChild(createSearchRow("Last updated", (new Date(json.updated_at)).toUTCString()))
    }
    return tableSearchResults;
}

function createSearchRow(title, cellContent)
{
    row = document.createElement("tr");
    cell = document.createElement("td");
    cell.innerHTML = title
    row.appendChild(cell);
    cell = document.createElement("td");
    if (cellContent.nodeType)
        cell = cellContent;
    else
        cell.innerHTML = cellContent;
    row.appendChild(cell);
    return row;
}

function checkSearchButton()
{
    btn = document.getElementById("searchButton");
    if (document.getElementById("searchTerm").value.trim() != "")
        btn.disabled = false;
    else
        btn.disabled = true;
}