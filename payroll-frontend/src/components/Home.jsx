import React from "react";
import { Link } from "react-router-dom";

const Home = ({ isLoggedIn }) => {
  return (
    <div>
      <h1>PrestaBanco</h1>
      <p>
        Bienvenido a PrestaBanco, tu plataforma para gestionar solicitudes de crédito.
      </p>
      {!isLoggedIn && (
        <p>
          Para acceder a todas las funcionalidades, por favor{" "}
          <Link to="/login">inicia sesión</Link> o{" "}
          <Link to="/register">regístrate</Link>.
        </p>
      )}
      <p>
        Esta aplicación utiliza tecnologías modernas como{" "}
        <a href="https://spring.io/projects/spring-boot">Spring Boot</a>,{" "}
        <a href="https://reactjs.org/">React</a>, y{" "}
        <a href="https://www.mysql.com/products/community/">MySQL</a>.
      </p>
    </div>
  );
};

export default Home;
