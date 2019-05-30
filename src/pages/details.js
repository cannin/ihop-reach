import React from "react"
import { Link } from "gatsby"
import 'font-awesome/css/font-awesome.min.css';

import style from '../assets/styles/details.module.scss'
import Layout from '../components/layout'

const SearchPage = () => {
    return (
        <Layout>
            <div className="container my-4">
                {/* Instruction block */}
                <div>
                    <h1 className="display-4 w-100">SNF1</h1>
                    <div>
                        <div className="table-responsive">
                            <table className="table ">
                                <thead class="thead-light">
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
                        <p>
                            <ul className={style.detailsLinks}>
                                <li><a href="">Link 1</a></li>
                                <li><a href="">Link 2</a></li>
                                <li><a href="">Link 3</a> Details if any</li>
                            </ul>                     
                        </p>
                    </div>
                </div>
                <div className={style.sentenceContainer}>
                    <p className="lead">Sentences in this view contain interactions of SNF1</p>
                    <table>
                        <tr>
                            <div>We show that SNF4 binds to the SNF1 regulatory domain in low glucose [?], whereas in high glucose [?] the regulatory domain binds to the kinase domain of SNF1 itself. [1996]</div>
                        </tr>
                        <tr>
                            <div>We first show that the fraction of cellular Snf4 protein that is complexed with Snf1 is reduced in a sip1delta sip2delta gal83delta triple mutant. [1997]</div>
                        </tr>
                        <tr>
                            <div>This gene activation depended on the previously identified derepression genes CAT1 (SNF1) (encoding a protein kinase) and CAT3 (SNF4) (probably encoding a subunit of Cat1p [Snf1p]). [1995] </div>
                        </tr>
                        <tr>
                            <div>The SNF4-beta-galactosidase protein coimmunoprecipitated with the SNF1 protein kinase, thus providing evidence for the physical association of the two proteins. [1989]</div>
                        </tr>
                        <tr>
                            <div>Increased SNF1 gene dosage partially compensates for a mutation in SNF4, and the SNF4 function is required for maximal SNF1 protein kinase activity in vitro. [1989]</div>
                        </tr>
                        <tr>
                            <div>We have here addressed the role of the Snf4 (gamma) subunit in regulating SNF1 protein kinase in response to glucose [?] availability in Saccharomyces cerevisiae. [2008]</div>
                        </tr>
                        <tr>
                            <div>Finally, cells lacking the gamma subunit of the Snf1 kinase complex encoded by the SNF4 gene exhibited normal regulation of threonine 210 phosphorylation in response to glucose [?] limitation but are unable to phosphorylate Mig1 efficiently. [2001]</div>
                        </tr>
                        <tr>
                            <div>Regulation of Snf1 kinase. Activation requires phosphorylation of threonine 210 by an upstream kinase as well as a distinct step mediated by the Snf4subunit. [2001]</div>
                        </tr>
                        <tr>
                            <div>In two-hybrid assays, one SNF4 mutation enhances the interaction between Snf4 and Snf1. [1999]</div>
                        </tr>
                        <tr>
                            <div>The SNF1 protein kinase and the associated SNF4 protein are required for release of glucose [?] repression in Saccharomyces cerevisiae. [1992]</div>
                        </tr>
                        <tr>
                            <div>The SNF4 protein is physically associated with SNF1 and positively affects the kinase activity. [1992] </div>
                        </tr>
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

export default SearchPage