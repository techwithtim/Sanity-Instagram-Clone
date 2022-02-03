import { useState } from "react";
import { Form, Button, ListGroup, Card } from "react-bootstrap";
import ProfileListItem from "./ProfileListItem";
import "../Search.css";

export default function Search() {
  const [searchText, updateSearchText] = useState("");
  const [searchResults, updateSearchResults] = useState([]);

  function searchUpdated(e) {
    updateSearchText(e.target.value);
  }

  function searched(e) {
    e.preventDefault();
    fetch(`/searchForUsername?text=${searchText}`)
      .then((res) => res.json())
      .then((data) => {
        updateSearchResults(data);
      })
      .catch(console.error);
  }

  return (
    <div className="search">
      <div className="search-wrapper">
        <Form className="search-form" onSubmit={searched}>
          <Form.Group className="search-field">
            <Form.Control
              id="searchBar"
              onInput={searchUpdated}
              placeholder="Search for a username"
            />
          </Form.Group>
          <Button type="submit">Search</Button>
        </Form>
        {searchResults.length > 0 ? (
          <div className="search-results-wrapper">
            <Card style={{ width: "100%" }}>
              <ListGroup variant="flush">
                {searchResults.map((item, idx) => (
                  <ProfileListItem {...item} idx={idx} />
                ))}
              </ListGroup>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  );
}
