// @flow

import React from "react"

import "font-awesome/css/font-awesome.min.css"

class Links extends React.Component {
  constructor(props) {
    super(props)
  }
  linkParser = identifier => {
    // list of baseURLs
    const baseURL = {
      // [namespace]  : [baseURL, Name of the namespace]
      ["go"]: ["http://identifiers.org/go/", "GO"],
      ["uniprot"]: ["http://identifiers.org/uniprot/", "UniProt"],
      ["hmdb"]: ["http://identifiers.org/hmdb/", "HMDB"],
      ["pubchem"]: ["http://identifiers.org/pubchem.compound/", "PubChem"],
      ["pfam"]: ["http://identifiers.org/pfam/", "Pfam"],
      ["interpro"]: ["http://identifiers.org/interpro/", "InterPro"],
      ["be"]: ["https://github.com/sorgerlab/famplex", "FamPlex"],
      ["taxonomy"]: ["http://identifiers.org/taxonomy/", "Taxonomy"],
      ["chebi"]: ["http://identifiers.org/chebi/", "ChEBI"],
    }
    var namespace, id
    var identifierArray = identifier.split(/:(.+)/)
    //splitting the identifier into namespace and id
    namespace = identifierArray[0]
    id = identifierArray[1] // for identifiers with 2 components
    var urlID = namespace === "be" ? "" : id //condition for be namespace
    var urlNamespace = baseURL[namespace][0] // getting url
    // checking url validity
    if (urlNamespace !== undefined || id !== undefined)
      return (
        <span>
          {baseURL[namespace][1]}: <a href={urlNamespace + urlID}>{id}</a>
        </span>
      )
    else return null
  }
  render() {
    return (
      <ul className={this.props.className}>
        <li>{this.linkParser(this.props.identifier)}</li>
      </ul>
    )
  }
}

export default Links
