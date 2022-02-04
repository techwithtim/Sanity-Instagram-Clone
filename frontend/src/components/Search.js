import { useState } from "react";
import { Form, Button, ListGroup, Card } from "react-bootstrap";
import ProfileListItem from "./ProfileListItem";
import "../css/Search.css";

export default function Search() {
  const [searchText, updateSearchText] = useState("");
  const [searchResults, updateSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  function searchUpdated(e) {
    updateSearchText(e.target.value);
  }

  function searched(e) {
    e.preventDefault();
    setLoading(true);
    fetch(`/searchForUsername?text=${searchText}`)
      .then((res) => res.json())
      .then((data) => {
        updateSearchResults(data);
        setLoading(false);
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
        {loading ? <p>Loading...</p> : null}
        {searchResults.length > 0 && !loading ? (
          <div className="search-results-wrapper">
            <Card style={{ width: "100%" }}>
              <ListGroup variant="flush">
                {searchResults.map((item, idx) => (
                  <ProfileListItem {...item} idx={idx} />
                ))}
              </ListGroup>
            </Card>
          </div>
        ) : !loading ? (
          <p>No Search Results...</p>
        ) : null}
      </div>
    </div>
  );
}
