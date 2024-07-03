// BookmarkTree.js

import React, { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Collapse, Button } from '@mui/material';
import { Folder, ExpandLess, ExpandMore, Bookmark } from '@mui/icons-material';
import axios from 'axios';

const BookmarkTree = ({ nodes }) => {
    const [open, setOpen] = useState({});

    const handleClick = (index) => {
        setOpen((prevOpen) => ({
            ...prevOpen,
            [index]: !prevOpen[index],
        }));
    };

    const renderNodes = (nodes) =>
        nodes.map((node, index) => (
            <React.Fragment key={index}>
                {node.type === 'folder' ? (
                    <>
                        <ListItem button onClick={() => handleClick(index)} style={{ paddingLeft: `${node.level * 20}px` }}>
                            <ListItemIcon>
                                <Folder />
                            </ListItemIcon>
                            <ListItemText primary={node.name} />
                            {open[index] ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {renderNodes(node.children)}
                            </List>
                        </Collapse>
                    </>
                ) : (
                    <BookmarkListItem node={node} />
                )}
            </React.Fragment>
        ));

    const BookmarkListItem = ({ node }) => {
        const [imageUrl, setImageUrl] = useState('');
        const [thumbnailFetched, setThumbnailFetched] = useState(false);

        const fetchThumbnail = async (url) => {
            try {
                const response = await axios.get(`http://localhost:3001/screenshot?url=${encodeURIComponent(url)}`, {
                    responseType: 'arraybuffer',
                });

                const base64String = btoa(
                    new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                const imageUrl = `data:image/png;base64,${base64String}`;

                setImageUrl(imageUrl);
            } catch (error) {
                console.error('Error fetching thumbnail:', error);
            } finally {
                setThumbnailFetched(true);
            }
        };

        const handleFetchDetails = () => {
            if (!thumbnailFetched) {
                fetchThumbnail(node.url);
            }
        };

        return (
            <ListItem
                style={{ paddingLeft: `${node.level * 20}px` }}
            >
                <ListItemIcon>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={node.name}
                            style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                        />
                    ) : (
                        <Bookmark />
                    )}
                </ListItemIcon>
                <ListItemText><a target="_blank" href={node.url} style={{ textDecoration: 'none' }}>{node.name}</a></ListItemText>
                <Button variant="outlined" onClick={handleFetchDetails} style={{ zIndex: 100 }}>
                    Fetch Details
                </Button>
            </ListItem>
        );
    };

    return <List component="nav">{renderNodes(nodes)}</List>;
};

export default BookmarkTree;
