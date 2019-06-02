// @flow

import React from "react"
import { Link , graphql} from "gatsby"
import 'font-awesome/css/font-awesome.min.css';

import style from '../assets/styles/details.module.scss'
import Layout from '../components/layout'
import Links from '../components/identifierDetails'
import SentenceView from '../components/sentenceView'

export default function DetailsTemplate({data}) {
    // data = data.ihop.entities.articles // This contains all the articles
    let searchTerm = data.ihop.entities.entity
    data = data.ihop.entities
    let entityName,entityType
    if((data.articles[0].extracted_information.participant_b.entity_text).toLowerCase()===searchTerm){
        entityName = data.articles[0].extracted_information.participant_b.entity_text
        entityType = data.articles[0].extracted_information.participant_b.entity_type
    }
    else {
        entityName = data.articles[0].extracted_information.participant_a.entity_text
        entityType = data.articles[0].extracted_information.participant_a.entity_type
    }
    return (
        <Layout>
            <div className="container my-4">
                {/* Instruction block */}
                <div>
                    <h1 className="display-4 w-100">
                        {entityName} 
                        <span className="lead"> {
                                (entityType).split("_").join(" ")
                            }
                        </span>
                    </h1>
                    <div>
                        <div className="table-responsive mb-2">
                            <table className="table">
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
                                        {/* <th>SNF1</th>
                                        <td>Snf1p</td>
                                        <td>CAT1, CCR1, GLC2, HAF3, PAS14 </td>
                                        <td>Saccharomyces cerevisiae S288c</td> */}
                                        <td colSpan="4"><center>This section is Under Construction</center></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <Links className={style.detailsLinks} data = {data.articles}/>
                    </div>
                </div>
                <div className={style.sentenceContainer}>
                    <p className="lead">Sentences in this view contain interactions of&nbsp;
                        <b>
                            {
                                entityName
                            }
                        </b>
                    </p>
                    <table className="w-100">
                        <SentenceView data= {data} className={null}/>
                        <tfoot className="invisible">
                            <tr>
                                <td colSpan="2">
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
                                </td>
                            </tr>
                        </tfoot>
                    </table>                    
                </div>
            </div>
        </Layout>
    )
}

export const detailsQuery = graphql`
    query detailsByEntity($name: String!) {
        ihop {
            entities(name: $name) {
                articles {
                    extracted_information {
                        participant_a {
                            entity_text
                            entity_type
                            identifier
                        }
                        participant_b {
                            entity_text
                            entity_type
                            identifier
                        }
                    }
                    trigger
                    evidence
                    pmc_id
                }
                entity
            }
        }
    }
`