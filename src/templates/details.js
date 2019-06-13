// @flow

import React from "react"
import { Link, graphql } from "gatsby"
import "font-awesome/css/font-awesome.min.css"

import style from "../assets/styles/details.module.scss"
import Layout from "../components/layout"
import Links from "../components/identifierDetails"
import SentenceView from "../components/sentenceView"

export default function DetailsTemplate({ data }) {
  // data = data.ihop.entities.articles // This contains all the articles

  let searchID = data.ihop.articlesByIdentifier.searchkey
  let synonyms = data.mongodbIhopIdentifierMapping.syn
  let entityName = synonyms[0]
  let entityType = data.mongodbIhopIdentifierMapping.typ
  data = data.ihop.articlesByIdentifier
  return (
    <Layout>
      <div className="container my-4">
        <div>
          <h1 className="display-4 w-100">
            {entityName}
            <span className="lead"> {entityType.split("_").join(" ")}</span>
          </h1>
          <table className={"table " + style.infoTable}>
            <Links
              className={style.detailsLinks}
              data={data.articles}
              identifier={searchID}
              synonyms={synonyms}
            />
          </table>
        </div>
        <div className={style.sentenceContainer}>
          <p className="lead">
            Sentences in this view contain interactions of&nbsp;
            <b>{entityName}</b>
          </p>
          <table className="w-100">
            <SentenceView data={data} identifier={searchID} className={null} />
            <tfoot className="invisible">
              <tr>
                <td colSpan="2">
                  <div className="mt-2 w-100">
                    <ul className="pagination pagination-sm float-right">
                      <li className="page-item disabled">
                        <span className="page-link">
                          <i className="fa fa-chevron-left" />
                        </span>
                      </li>
                      <li className="page-item active">
                        <span className="page-link" href="#">
                          1
                        </span>
                      </li>
                      <li className="page-item">
                        <span className="page-link" href="#">
                          2
                        </span>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          3
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          4
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          5
                        </a>
                      </li>
                      <li className="page-item">
                        <span className="page-link">
                          <i className="fa fa-chevron-right" />
                        </span>
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
  query detailsByID($id: String!) {
    ihop {
      articlesByIdentifier(id: $id) {
        searchkey
        articles {
          pmc_id
          evidence
          trigger
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
            hypothesis_information
          }
        }
      }
    }
    mongodbIhopIdentifierMapping(iden: { eq: $id }) {
      typ
      syn
    }
  }
`
