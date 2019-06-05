import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import pageNotFoundImg from "../assets/img/404.png"

const NotFound = () => {
  return (
    <Layout>
      <div className="h-100 2-100 mx-auto my-auto">
        <center className="my-auto h-100">
          <img
            src={pageNotFoundImg}
            alt="404 Page not found"
            className="img-fluid my-auto"
          />
        </center>
      </div>
    </Layout>
  )
}

export default NotFound
