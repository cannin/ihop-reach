// @flow

import React from "react"
import { Link, graphql, StaticQuery, navigate } from "gatsby"
import PropTypes from "prop-types"

import "font-awesome/css/font-awesome.min.css"

import style from "../assets/styles/header.module.scss"
class Header extends React.Component {
  constructor({ props }) {
    super(props)
    this.state = {
      showAdvOption: false,
      showSearchRes: false,
      searching: false,
      searchMsg: "",
      showTypeAhead: false,
      typeahead: [],
    }
    this.searchInpBox = React.createRef()
  }
  searchKeyParser = key => {
    let keyArr = key
      .trim()
      .replace(/[~^*:]/g, "\\$&")
      .toLowerCase()
      .replace(/ /g, "*")
    return keyArr
  }
  typeAheadDisplayer = () => {
    if (this.state.typeahead.length > 0) {
      const typeAheadLimit = 6 // Change this to control number of results shown in typeahead
      let list = this.state.typeahead.slice(0, typeAheadLimit).map(prop => {
        return (
          <li key={prop.word + prop.link}>
            <Link to={"/details/" + prop.link}>{prop.word}</Link>
          </li>
        )
      })
      return <ul className={style.typeahead}>{list}</ul>
    } else return this.state.searchMsg
  }
  typeAheadController = () => {
    const searchKey = this.searchKeyParser(this.searchInpBox.current.value)
    if (searchKey.length < 2) {
      this.setState({ typeahead: [], showTypeAhead: false })
      return
    }
    if (window.__LUNR__) {
      window.__LUNR__.__loaded.then(res => {
        let refs = []
        try {
          refs = res.en.index.search(searchKey)
          if (refs.length == 0) {
            refs = res.en.index.query(q => {
              // exact matches should have the highest boost
              q.term(searchKey, { boost: 100 })

              // prefix matches should be boosted slightly
              q.term(searchKey, { boost: 50, usePipeline: false, wildcard: 2 })

              // finally, try a fuzzy search, without any boost
              q.term(searchKey, {
                boost: 1,
                usePipeline: false,
                editDistance: 1,
              })
            })
          }
        } catch (err) {
          this.setState({
            searchMsg: "Invalid Search",
            searching: false,
            showTypeAhead: true,
            typeahead: [],
          })
          return
        }
        let tempTypeAhead = []
        let key, word
        refs.map(({ ref, matchData }) => {
          for (let prop in matchData.metadata) word = prop
          key = res.en.store[ref].ide
          tempTypeAhead.push({
            word: word,
            link: key,
          })
        })
        switch (tempTypeAhead.length) {
          case 0:
            this.setState({
              searchMsg: "No Results Found",
              searching: false,
              showTypeAhead: true,
              typeahead: [],
            })
            break
          //No results

          default:
            //Array of results
            this.setState({
              typeahead: tempTypeAhead,
              showSearchRes: true,
              showTypeAhead: true,
              searching: false,
            })
            break
        }
      })
    }
  }
  searchController = event => {
    event.preventDefault()
    const searchKey = this.searchKeyParser(this.searchInpBox.current.value)
    if (searchKey.length < 2) return null

    this.setState(
      {
        typeahead: [],
        searchMsg: "Searching...",
        showSearchRes: true,
        searching: true,
      },
      () => {
        if (window.__LUNR__) {
          window.__LUNR__.__loaded.then(res => {
            let refs = []
            try {
              refs = res.en.index.search(searchKey)
              if (refs.length == 0) {
                refs = res.en.index.query(q => {
                  // exact matches should have the highest boost
                  q.term(searchKey, { boost: 100 })

                  // prefix matches should be boosted slightly
                  q.term(searchKey, {
                    boost: 50,
                    usePipeline: false,
                    wildcard: 2,
                  })
                  // wildcard 3 denotes prepend and append wildcard *
                  q.term(searchKey, {
                    boost: 10,
                    usePipeline: false,
                    wildcard: 3,
                  })

                  // finally, try a fuzzy search, without any boost
                  q.term(searchKey, {
                    boost: 1,
                    usePipeline: false,
                    editDistance: 1,
                  })
                })
              }
            } catch (err) {
              this.setState({
                searchMsg: "Invalid Search",
                showTypeAhead: true,
                searching: false,
              })
              return
            }
            const pages = refs.map(({ ref }) => {
              return res.en.store[ref]
            })
            console.log(pages)
            switch (pages.length) {
              case 1:
                navigate("/details/" + pages[0].ide, {
                  state: {
                    searchTerm: this.searchInpBox.current.value,
                  },
                })
                this.setState({
                  showSearchRes: false,
                  searching: false,
                })
                break
              case 0:
                this.setState({
                  searchMsg: "No Results Found",
                  showTypeAhead: true,
                  searching: false,
                })
                break
              //No results

              default:
                //Array of results
                navigate("/search", {
                  state: {
                    searchTerm: this.searchInpBox.current.value,
                    results: pages,
                  },
                })
                this.setState({
                  showSearchRes: false,
                  searching: false,
                })
                break
            }
          })
        }
      }
    )
  }
  searchInpBoxController = () => {
    this.setState({
      showSearchRes: false,
    })
    this.typeAheadController()
  }
  focusHandler = () => {
    this.setState({ showTypeAhead: !this.state.showTypeAhead })
  }
  typeaheadHandler = () => {
    this.setState({ showTypeAhead: true })
  }
  render() {
    const data = this.props.data
    let searchedTerm
    try {
      searchedTerm = window.history.state.searchTerm
    } catch (e) {
      searchedTerm = null
    }
    return (
      <header>
        <nav className={["navbar navbar-expand-lg bg-light"].join()}>
          <Link
            className={["navbar-brand mx-sm-5", style.brand].join(" ")}
            to="/"
            className="col-sm-1 col-12 text-center"
          >
            {/* <img className={style.logoImg} src={logo} alt="iHOP-Reach" /> */}
            <h5 className="mx-auto">
              <b>{data.site.siteMetadata.title}</b>
            </h5>
          </Link>
          <form
            className="form-inline my-0 col-sm-6 pr-0"
            onSubmit={this.searchController}
          >
            <div className="my-1 col px-0">
              <div className={"input-group " + style.searchBox}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  aria-label="Search"
                  aria-describedby="searchBtn"
                  id="searchInpBox"
                  defaultValue={searchedTerm}
                  ref={this.searchInpBox}
                  onChange={this.searchInpBoxController}
                  autoComplete="off"
                />
                <div className="input-group-append">
                  <button
                    disabled={this.state.searching}
                    className="input-group-text"
                    id="searchBtn"
                  >
                    {this.state.searching == true ? (
                      <i className="fa fa-circle-o-notch fa-spin" />
                    ) : (
                      <i className="fa fa-search" />
                    )}
                  </button>
                </div>
              </div>
              {this.state.showTypeAhead == true ? (
                <div
                  className={["px-0 container", style.noResultsBlock].join(" ")}
                >
                  <div
                    onFocus={this.typeaheadHandler}
                    className="col py-2"
                    style={{
                      border: "1px solid #ecf0f1",
                      boxShadow: "0 4px 6px 0 rgba(32,33,36,0.28)",
                    }}
                  >
                    {this.typeAheadDisplayer()}
                  </div>
                </div>
              ) : null}
              <small className={[style.advOptLink, "row"].join(" ")}>
                <span className={["col", "nav-text", style.egText].join(" ")}>
                  e.g. SNF1, Taxonomy:9606, UniProt:Q12794
                </span>
              </small>
            </div>
          </form>
        </nav>
        <div></div>
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
