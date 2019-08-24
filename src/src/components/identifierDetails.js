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
        <tr>
          <td>{baseURL[namespace][1]}</td>
          <td>
            <a href={urlNamespace + urlID} target="_blank">
              {id}
            </a>
          </td>
        </tr>
      )
    else return null
  }
  render() {
    const syn = this.props.synonyms
    return (
      <tbody className={this.props.className}>
        {this.linkParser(this.props.identifier)}
        {syn.length > 1 ? (
          <tr>
            <td>Matches</td>
            <td>{syn.join(", ")}</td>
          </tr>
        ) : null}
      </tbody>
    )
  }
}

export default Links
