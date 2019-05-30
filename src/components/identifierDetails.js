import React from "react"

import 'font-awesome/css/font-awesome.min.css';

class Links extends React.Component {
    constructor(props){
        super(props)        
    }
    linkParser = (identifier) => {
        // list of baseURLs
        const baseURL = {
            ['go']          : 'http://identifiers.org/go/',
            ['uniprot']     : 'http://identifiers.org/uniprot/',
            ['hmdb']        : 'http://identifiers.org/hmdb/',
            ['pubchem']     : 'http://identifiers.org/pubchem.compound/',
            ['pfam']        : 'http://identifiers.org/pfam/',
            ['interpro']    : 'http://identifiers.org/interpro/',
            ['be']          : 'https://github.com/sorgerlab/bioentities'
        }        
        var namespace,id
        //splitting using destructuring
        [namespace,id] = identifier.split(":")
        var urlID = namespace=='be'?"":id //condition for be namespace
        var urlNamespace = baseURL[namespace.toLowerCase()] // getting url

        // checking url validity
        if(urlNamespace != undefined || id != undefined)
            return  <a href={urlNamespace + urlID}>{identifier}</a>
        else
            return null
    }
    identifierToLink = () => {
        //function to traverse the data object
        return Object.keys(this.props.data.article.extracted_information).map(
            participant => 
                <li>
                    {
                        // call to function to resolve the URLs
                        this.linkParser(this.props.data.article.extracted_information[participant].identifier)
                    }
                </li>            
        )
    }
    render() {
        return (
            <ul className = {this.props.className}>
                { this.identifierToLink() }
            </ul>
        )
    }
}

export default Links