import React from "react"
import { Link } from "gatsby"
import 'font-awesome/css/font-awesome.min.css';

import style from '../assets/styles/details.module.scss'
import Layout from '../components/layout'
import Links from '../components/identifierDetails'
import SentenceView from '../components/sentenceView'
const DetailsPage = () => {
    const data = {
        "article": {
            "submitter" : "Reach",
            "model_relation" : "extension",
            "extracted_information" : {
                "interaction_type" : "decreases_activity",
                "negative_information" : true,
                "participant_b" : {
                    "in_model" : true,
                    "identifier" : "chebi:CHEBI:1327",
                    "entity_text" : "cGMP",
                    "entity_type" : "simple_chemical"
                },
                "participant_a" : {
                    "in_model" : true,
                    "identifier" : "interpro:IPR000818",
                    "entity_text" : "TEA",
                    "entity_type" : "family"
                },
                "hypothesis_information" : false
            },
            "reading_complete" : "2016-01-08T14:49:54Z",
            "reader_type" : "machine",
            "reading_started" : "2016-01-08T14:48:55Z",
            "trigger" : "inhibit",
            "evidence" : [ 
                "TEA does not inhibit the cGMP",
                "cGMP does not inhibit the TEA"
            ],
            "pmc_id" : "100781",
            "score" : 0
        }        
      }
    return (
        <Layout>
            <div className="container my-4">
                {/* Instruction block */}
                <div>
                    <h1 className="display-4 w-100">
                        {data.article.extracted_information.participant_b.entity_text} 
                        <span className="lead"> {data.article.extracted_information.participant_b.entity_type.split("_").join(" ")}</span>
                    </h1>
                    <div>
                        <div className="table-responsive mb-2">
                            <table className="table ">
                                <thead className="thead-light">
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Name</th>
                                        <th>Synonyms</th>
                                        <th>Organism</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>SNF1</th>
                                        <td>Snf1p</td>
                                        <td>CAT1, CCR1, GLC2, HAF3, PAS14 </td>
                                        <td>Saccharomyces cerevisiae S288c</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <Links className={style.detailsLinks} data = {data.article.extracted_information}/>
                    </div>
                </div>
                <div className={style.sentenceContainer}>
                    <p className="lead">Sentences in this view contain interactions of {data.article.extracted_information.participant_b.entity_text}</p>
                    <table>
                        <SentenceView data= {data.article} />
                    </table>
                    <div className="mt-2 w-100">
                        <ul className="pagination pagination-sm float-right">
                        <li className="page-item disabled">
                            <span className="page-link"><i className="fa fa-chevron-left"></i></span>
                        </li>
                        <li className="page-item active">
                            <span className="page-link" href="#">1</span>
                        </li>
                        <li className="page-item">
                            <span className="page-link" href="#">2</span>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">3</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">4</a>
                        </li>
                        <li className="page-item">
                            <a className="page-link" href="#">5</a>
                        </li>
                        <li className="page-item">
                            <span className="page-link"><i className="fa fa-chevron-right"></i></span>
                        </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default DetailsPage