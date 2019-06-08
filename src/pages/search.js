import React from "react"
import { navigate, Link } from "gatsby"
import Layout from "../components/layout"

import styles from "../assets/styles/search.module.scss"

export default class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      results: [],
      searchKey: "",
    }
  }
  componentDidMount() {
    if (
      this.props.location.state == undefined ||
      this.props.location.state.results == undefined
    ) {
      navigate("/", { replace: true })
      return
    }
    this.setState({
      results: this.props.location.state.results,
      searchKey: this.props.location.state.searchTerm,
    })
  }
  render() {
    return (
      <Layout>
        <div className="container my-4">
          <div>
            <p className="lead w-100">
              Search Results for <b>{this.state.searchKey}</b>
            </p>
            <div>
              <table className={"table " + styles.resTable}>
                <thead>
                  <tr>
                    <th>Identifier</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.results.map(res => (
                    <tr
                      key={res.ide}
                      onClick={() => navigate("/details/" + res.ide)}
                    >
                      <td>
                        <nobr>{res.ide}</nobr>
                      </td>
                      <td>{res.syn.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
