import React from "react";
import { Link } from "react-router-dom";

const Home = ({ isLoggedIn }) => {
  return (
    <div>
      <h1>PrestaBanco</h1>
      <p>
        Bienvenido a PrestaBanco, tu plataforma para gestionar solicitudes de créditos hipotecarios.
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

      <h2>Tipos de Préstamos</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f5f5f5", color: "#000", textAlign: "left" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tipo de Préstamo</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Plazo Máximo</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tasa Interés (Anual)</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Monto Máximo Financiamiento</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Requisitos Documentales</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>Primera Vivienda</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>30 años</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>3.5% - 5.0%</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>80% del valor de la propiedad</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              - Comprobante de ingresos<br />
              - Certificado de avalúo<br />
              - Historial crediticio
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>Segunda Vivienda</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>20 años</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>4.0% - 6.0%</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>70% del valor de la propiedad</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              - Comprobante de ingresos<br />
              - Certificado de avalúo<br />
              - Escritura de la primera vivienda<br />
              - Historial crediticio
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>Propiedades Comerciales</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>25 años</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>5.0% - 7.0%</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>60% del valor de la propiedad</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              - Estado financiero del negocio<br />
              - Comprobante de ingresos<br />
              - Certificado de avalúo<br />
              - Plan de negocios
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>Remodelación</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>15 años</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>4.5% - 6.0%</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>50% del valor actual de la propiedad</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              - Comprobante de ingresos<br />
              - Presupuesto de la remodelación<br />
              - Certificado de avalúo actualizado
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Home;
