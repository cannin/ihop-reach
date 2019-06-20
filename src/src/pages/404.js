import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import pageNotFoundImg from "../assets/img/404.png"

const NotFound = () => {
  return (

    <Layout>
        <div className = "row h-100 mt-3">
          <div className = "col-sm-4 my-auto">
            <img
              src={pageNotFoundImg}
              alt="404"
              className="img-fluid my-auto mx-auto"
            />          
          </div>
          <div className = "col-sm-8 my-auto">
            <h1 className="display-4 w-100">Page Not Found</h1>
            <p className="lead">
              We're sorry, we couldn't find the page you requested.
            </p>
            <hr />
            <p>
              <b>Search Tips</b><br/>
              Our Search supports wildcards when performing searches. A wildcard is represented as an asterisk (*) and can appear anywhere in a search term.
              By default we use wildcard at head and tail, to improve the results.<br/>The search edit distance is set as one, that means it can make 1 change in the searched term to prevent typographic error.<hr/> 
              For example:<br/><br/>
              <pre>&rarr; gluco</pre> will search for words having <b>gluco</b>, eg: <em>d-glucose, glucosylsphingosine</em> <br/><br/>
              <pre>&rarr; gl*co</pre> will search for words having <b>gl</b> and <b>co</b> in order, eg: <em>glycogen synthase, gluconate</em> 
            </p>
          </div>
        </div>
    </Layout>
  )
}

export default NotFound
