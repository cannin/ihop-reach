// @flow

import React from "react"
import { Link, graphql, StaticQuery, navigate } from "gatsby"
import PropTypes from "prop-types"

import "font-awesome/css/font-awesome.min.css"

import style from "../assets/styles/header.module.scss"
import logo from "../assets/img/logo.png"

class Header extends React.Component {
  constructor({ props }) {
    super(props)
    this.state = {
      showAdvOption: false,
      noResults: false,
    }
    this.searchInpBox = React.createRef();    
  }
  searchController = (event) => {
    event.preventDefault()
    const searchKey = this.searchInpBox.current.value
    if(window.__LUNR__) {
      window.__LUNR__.__loaded.then(lunr => {
              const refs = lunr.en.index.search(searchKey);
              const pages = refs.map(({ ref }) => lunr.en.store[ref]);
              switch (pages.length) {
                  case 1:
                    navigate("/details/" + pages[0].identifier,
                      {
                        state: { 
                          searchTerm : searchKey
                         }
                      }
                    )
                    break
                  case 0:
                    this.setState({
                      noResults: true,
                    })
                    break
                      //No results

                  default:
                      break;
              }
              // const posts = refs.map(({ ref }) => lunr.en.store[ref]);
              // setResults(posts)
          }
      )
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
                    defaultValue="all"
                  >
                    <option value="all" disabled hidden>
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
                    defaultValue = "all"
                  >
                    <option value="all" disabled hidden>
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
    this.setState((state) => ({
      showAdvOption: !state.showAdvOption,
    }))
  }
  searchInpBoxController = () => {    
    this.setState({
      noResults: false,
    })
  }
  render() {
    const data = this.props.data
    let searchedTerm
    try{
      searchedTerm = window.history.state.searchTerm
    }
    catch(e){
      searchedTerm = null
    }
    return (
      <header>
        <nav className={["navbar navbar-expand-lg bg-light"].join()}>
          <Link
            className={["navbar-brand mx-sm-5", style.brand].join(" ")}
            to="/"
          >
            {/* <img className={style.logoImg} src={logo} alt="iHOP-Reach" /> */}
            <strong className="mx-auto">{data.site.siteMetadata.title}</strong>
          </Link>
          <form className="form-inline my-0 col-sm-6 pr-0" onSubmit={this.searchController}>
            <div className="my-1 col px-0">
              <div className = { "input-group " + style.searchBox }>
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="searchBtn"
                id = "searchInpBox"
                defaultValue = {searchedTerm}
                ref = {this.searchInpBox}
                onChange = {this.searchInpBoxController}
              />
              <div className="input-group-append">
                <button
                  className="input-group-text"
                  id="searchBtn"
                >
                  <i className="fa fa-search" />
                </button>
              </div>
              </div>
              {
                this.state.noResults==true?(
                  <div className={["px-0 container",style.noResultsBlock].join(" ")}>
                    <div className="col py-2">
                      No Results Found
                    </div>
                  </div>
                ):null
              }
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
            this.advOption()
          }
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
