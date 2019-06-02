// @flow

import React from "react"

import 'font-awesome/css/font-awesome.min.css';

class Links extends React.Component {
    constructor(props){
        super(props)
        this.array = []
    }
    linkParser = (identifier) => {
        // list of baseURLs
        const baseURL = {
            // [namespace]  : [baseURL, Name of the namespace]
            ['go']          : ['http://identifiers.org/go/',"GO"],
            ['uniprot']     : ['http://identifiers.org/uniprot/',"UniProt"],
            ['hmdb']        : ['http://identifiers.org/hmdb/',"HMDB"],
            ['pubchem']     : ['http://identifiers.org/pubchem.compound/',"PubChem"],
            ['pfam']        : ['http://identifiers.org/pfam/',"Pfam"],
            ['interpro']    : ['http://identifiers.org/interpro/',"InterPro"],
            ['be']          : ['https://github.com/sorgerlab/famplex',"FamPlex"],
            ['taxonomy']    : ['http://identifiers.org/taxonomy/',"Taxonomy"],
            ['chebi']       : ['http://identifiers.org/chebi/CHEBI:',"ChEBI"]
        }        
        var namespace,id
        var identifierArray = identifier.split(":")        
        //splitting the identifier into namespace and id
        namespace = identifierArray[0].toLowerCase()
        if(namespace==='uazid') return null
        id = identifierArray[identifierArray.length-1] // for identifiers with 3 components
        var urlID = namespace==='be'?"":id //condition for be namespace
        var urlNamespace = baseURL[namespace][0] // getting url
        // checking url validity
        if(urlNamespace !== undefined || id !== undefined)
            return  <span>{baseURL[namespace][1]}: <a href={urlNamespace + urlID}>{id}</a></span>
        else
            return null
    }
    identifierToLink = (article) => {
        //function to traverse the data object
        Object.keys(article).map(
            participant => {
                if((article[participant]=== null) || (article[participant]=== undefined))
                    return
                try{                    
                    this.array.push(article[participant].identifier)
                }
                catch(e){
                    console.log(article,participant)
                    console.log(e)
                }
            }     
        )
    }
    render() {            
        try {
            this.props.data.map((identifier) => {                            
                       this.identifierToLink(identifier.extracted_information)
                    }
                )
        } catch (error) {
            console.log(error)
            return null
        }
        var unique = Array.from([...new Set(this.array)][0])
        return (
            <ul className = {this.props.className}>
            { 
                unique.map((identifier) => {
                            return <li key={identifier}>{this.linkParser(identifier)}</li>
                        }
                    )
            }
            </ul>    
        )
    }
}

export default Links