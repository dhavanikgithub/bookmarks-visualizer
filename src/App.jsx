import React, { useState } from 'react';
import BookmarkTree from './components/BookmarkTree';
import { Button } from '@mui/material';
import axios from 'axios';
import BookmarkDetails from './components/BookmarkDetails';

function App() {
  const [bookmarks, setBookmarks] = useState(null);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const htmlContent = e.target.result;
      const parsedBookmarks = parseBookmarks(htmlContent);
      console.log(parsedBookmarks)
      setBookmarks(parsedBookmarks);
    };
    reader.readAsText(file);
  };

  const parseBookmarks = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const root = doc.querySelector('DL');
    return parseBookmarkNode(root);
  };

  const parseBookmarkNode = (node, level = 0) => {
    const children = [];
    if (!node) return children;

    let currentNode = node.firstElementChild;

    while (currentNode) {
      if (currentNode.nodeName === 'DT') {
        const link = currentNode.querySelector('A');
        const folder = currentNode.querySelector('H3');

        if (folder) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(currentNode.innerHTML, 'text/html');
          const siblingNode = doc.querySelector('DL');

          if (siblingNode && siblingNode.nodeName === 'DL') {
            children.push({
              type: 'folder',
              name: folder.textContent,
              children: parseBookmarkNode(siblingNode, level + 1),
              level: level + 1,
            });
          }
        } else if (link) {
          children.push({
            type: 'link',
            name: link.textContent,
            url: link.href,
            level: level + 1,
          });
        }
      }
      currentNode = currentNode.nextElementSibling;
    }

    return children;
  };

  return (
    <div className="App">
      <BookmarkDetails url="https://js-nzvb6z.stackblitz.io/" />
      {/* <input
        accept=".html"
        style={{ display: 'none' }}
        id="upload-file"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="upload-file">
        <Button variant="contained" component="span">
          Upload Bookmarks HTML
        </Button>
      </label>
      {bookmarks && <BookmarkTree nodes={bookmarks} />} */}
    </div>
  );
}

export default App;
