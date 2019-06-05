// @flow

import React from "react"
import { Link, graphql, StaticQuery } from "gatsby"
import PropTypes from "prop-types"

import "font-awesome/css/font-awesome.min.css"

import style from "../assets/styles/header.module.scss"
import logo from "../assets/img/logo.png"

class Header extends React.Component {
  constructor({ props }) {
    super(props)
    this.state = {
      showAdvOption: false,
    }
  }
  advOption = () => {
    if (this.state.showAdvOption)
      return (
        <div className={style.advOptDiv}>
          <nav className="navbar py-2 bg-light">
            <div className="container">
              <div className="row">
                <div className="col-sm-4 py-1">Advanced Options</div>
                {/* Section for Field filter */}
                <div className="col">
                  <select
                    className="custom-select custom-select-sm"
                    name="field"
                    id="field"
                  >
                    <option value="all" selected disabled hidden>
                      Specify fields
                    </option>
                    <option value="synonym">synonyms</option>
                    <option value="dbref">any accession number</option>
                    <option value="NCBI_LOCUSLINK__ID">NCBI Gene</option>
                    <option value="UNIPROT__AC">UniProt</option>
                    <option value="Google">Google</option>
                  </select>
                </div>
                {/* Section for organism filter */}
                <div className="col">
                  <select
                    className="custom-select custom-select-sm"
                    name="ncbi_tax_id"
                    id="ncbi_tax_id"
                  >
                    <option value="-2" selected disabled hidden>
                      Specify organism...
                    </option>
                    <optgroup>
                      <option value="9606">Homo sapiens</option>
                      <option value="9598">Pan troglodytes</option>
                      <option value="9544">Macaca mulatta</option>
                      <option value="9615">Canis familiaris</option>
                      <option value="9913">Bos taurus</option>
                      <option value="10090">Mus musculus</option>
                      <option value="10116">Rattus norvegicus</option>
                    </optgroup>
                    <optgroup>
                      <option value="9031">Gallus gallus</option>
                      <option value="8364">Xenopus tropicalis</option>
                      <option value="7955">Danio rerio</option>
                      <option value="31033">Takifugu rubripes</option>
                    </optgroup>
                    <optgroup>
                      <option value="3702">Arabidopsis thaliana</option>
                      <option value="4530">Oryza sativa</option>
                    </optgroup>
                    <optgroup>
                      <option value="7227">Drosophila melanogaster</option>
                      <option value="7165">Anopheles gambiae</option>
                      <option value="6239">Caenorhabditis elegans</option>
                    </optgroup>
                    <optgroup>
                      <option value="4932">Saccharomyces cerevisiae</option>
                      <option value="4896">Schizosaccharomyces pombe</option>
                      <option value="562">Escherichia coli</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )
  }
  advOptionController = () => {
    this.setState(state => ({
      showAdvOption: !state.showAdvOption,
    }))
  }
  render() {
    const data = this.props.data
    return (
      <header>
        <nav className={["navbar navbar-expand-lg bg-light"].join()}>
          <a
            className={["navbar-brand mx-sm-5", style.brand].join(" ")}
            href="/"
          >
            {/* <img className={style.logoImg} src={logo} alt="iHOP-Reach" /> */}
            <strong className="mx-auto">{data.site.siteMetadata.title}</strong>
          </a>
          <form className="form-inline my-0 col-sm-6">
            <div className="input-group my-1 col">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="searchBtn"
              />
              <div className="input-group-append">
                <button
                  className="input-group-text"
                  type="button"
                  id="searchBtn"
                >
                  <i className="fa fa-search" />
                </button>
              </div>
              {/* Advanced option button */}
              <small
                className={[style.advOptLink, "row"].join(" ")}
                onClick={this.advOptionController}
              >
                <span
                  className={["col-sm-8", "nav-text", style.egText].join(" ")}
                >
                  e.g. SNF1, Taxonomy:9606, UniProt:Q12794
                </span>
                <span
                  className={["col-sm-4", "nav-link", style.advText].join(" ")}
                >
                  Advanced Options
                  {this.state.showAdvOption == true ? (
                    <i className="fa fa-times" />
                  ) : (
                    <i className="fa fa-caret-down" />
                  )}
                </span>
              </small>
            </div>
          </form>
        </nav>
        <div>
          {// Advanced option
          this.advOption()}
        </div>
      </header>
    )
  }
}

export default props => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => <Header data={data} {...props} />}
  />
)

Header.propTypes = {
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
}
