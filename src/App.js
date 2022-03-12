import { useState } from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import classes from "./App.module.css";

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  min-height: 100vh;
`;

const StickyHeader = styled.nav`
  position: sticky;
  top: 0;
  height: 6rem;
  background: #fcba03;
  color: white;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-template-rows: auto;
  gap: 1.2rem;
  width: 80vw;
`;

const Wrapper = styled.div`
  background: #ebdbda;
  padding: 30px;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

const Pages = styled.div`
  display: flex;
  width: 70%;
  justify-content: space-evenly;
  align-items: center;
  padding: 10px;
`;

const fetcher = async (page) => {
  const response = await fetch(`http://localhost:4000/api?page=${page}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
};

const Pagination = ({ data, page, clickHandler }) => {
  const arrowStyles = {
    fontSize: "1.5rem",
  };

  return (
    <Pages>
      <MdKeyboardArrowLeft
        onClick={clickHandler}
        style={arrowStyles}
        id="prev"
      />
      {data.map((entry, index) => (
        <section key={index} className={index === page ? classes.active : ""}>
          <span onClick={clickHandler} id="current">
            {index}
          </span>
        </section>
      ))}
      <MdKeyboardArrowRight
        onClick={clickHandler}
        style={arrowStyles}
        id="next"
      />
    </Pages>
  );
};

const Container = ({ data }) => {
  return (
    <Grid>
      {data.map((post) => (
        <Wrapper key={post.id}>
          <p
            style={{
              marginBottom: "1rem",
            }}
          >
            <strong>{post.title.toUpperCase()}</strong>
          </p>
          <p>{post.body}</p>
        </Wrapper>
      ))}
    </Grid>
  );
};

const App = () => {
  const [page, setPage] = useState(0);
  const { isLoading, isError, data, error, isPreviousData } = useQuery(
    [`posts`, page],
    () => fetcher(page),
    { keepPreviousData: true }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  const clickHandler = (e) => {
    const id = e.target.id;
    if (id === "next") setPage((old) => Math.max(old + 1));
    if (id === "prev") setPage((old) => Math.max(old - 1, 0));
    setPage(() => +e.target.textContent);
  };

  return (
    <Main>
      <StickyHeader>
        <h1>React Query Testing</h1>
      </StickyHeader>
      <Container data={data.data} />
      <Pagination data={data.data} page={page} clickHandler={clickHandler} />
    </Main>
  );
};

export default App;
