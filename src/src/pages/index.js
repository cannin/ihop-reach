// @flow

import React from "react"

import Layout from "../components/layout"

const IndexPage = () => {
  return (
    <Layout>
      <div className="container my-4">
        {/* About block */}
        <div>
          <h1 className="display-4 w-100">About</h1>
          <div>
            <p className="lead">
              An application for users to access biological data extracted from biomedical literature. 
              We index over 3million sentences extracted using Natural Language Processing of articles 
              present in PubMed Central repository.
            </p>
          </div>
        </div>

        {/* Search Tips block */}
        <div>
          <h1 className="display-4 w-100">Search Tips</h1>
          <div>
            <p className="lead">
              By default, searh is set to prepend and append wildcards to the searched term.
              It can tolerate one edit distance to match the query to prevent typographic error.
            </p>
            <p>
            For example:
            <br />
            <br />
            <pre>&rarr; gluco</pre> will search for words having <b>gluco</b>,
            eg: <em>d-glucose, glucosylsphingosine</em> <br />
            <br />
            <pre>&rarr; gl*co</pre> will search for words having <b>gl</b> and{" "}
            <b>co</b> in order, eg: <em>glycogen synthase, gluconate</em>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
