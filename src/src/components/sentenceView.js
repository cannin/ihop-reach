// @flow

import React from "react"
import { Cookies } from "react-cookie"
import style from "../assets/styles/sentenceView.module.scss"
type Props = {
  data: Object,
  className: string,
}

class SentenceView extends React.Component<Props> {
  constructor() {
    super()
    this.state = {
      allSentences : [],
      displayRes : [],
      pmc : null,
      hypo : null,
      negInfo: null,
      human : false,
      search: null
    }
  }
  highlighter = (sentence: string, data: Object, identifier: string) => {
    const color = {
      celltype: "#e9b54d",
      cellular_component: "#85b6d8",
      family: "#7a1199",
      gene_or_gene_product: "#445e2b",
      organ: "#fc751b",
      protein: "#0000ff",
      simple_chemical: "#cf7d8a",
      site: "#85b6d8",
      species: "#15407a",
      trigger: "inherit",
      current: "red",
    }
    let terms = []
    let entityText, entityColor, entityType, replacement
    //trigger
    if (data.trigger != undefined) {
      terms.push({
        text: data.trigger,
        color: color["trigger"],
        type: "Trigger",
      })
    }

    //participants
    const participantA = data.extracted_information.participant_a
    const participantB = data.extracted_information.participant_b
    const participants = Array.from(
      new Set(participantA.concat(...participantB))
    )
    if (participants.length == 0) return null
    participants.forEach(participant => {
      entityText = participant.entity_text
      entityType = participant.entity_type.split("_").join(" ")
      if (participant.identifier == identifier) {
        entityColor = color["current"]
        entityType = "Current"
      } else entityColor = color[participant.entity_type]
      terms.push({
        text: entityText,
        color: entityColor,
        type: entityType,
        identifier: participant.identifier,
      })
    })
    terms.forEach(word => {
      if (
        word.type != "Current" &&
        word.type != "Trigger" &&
        word.identifier.search(new RegExp("uazid", "i")) < 0
      )
        replacement = `<a target="_blank" href="./${
          word.identifier
        }" style="color:${word.color}" title="${word.type}"><b><u>${
          word.text
        }</u></b></a>`
      else
        replacement = `<span style="cursor:default; color:${
          word.color
        }" title="${word.type}"><b>${word.text}</b></span>`
      sentence = sentence.replace(word.text, replacement)
    })
    return sentence
  }
  setCookieOnPmcLinkClick = (id, sentence) => {
    let cookieExpiry = new Date()
    cookieExpiry.setTime(cookieExpiry.getTime() + 24 * 60 * 60 * 1000)
    const cookie = new Cookies()
    cookie.set(
      "ihop-reach", // Cookie name
      JSON.stringify({
        pmc_id: id,
        text: sentence,
      }),
      {
        path: "/",
        expires: cookieExpiry,
        sameSite: "lax",
      }
    )
  }
  filterFunction = (obj) => {
    const {pmc,hypo,negInfo,human,search} = this.state
    let regx_pmc = new RegExp(pmc,"i")
    let regx_search = new RegExp(search,"i")
    return (
      (pmc!= null?(obj.pmcid.search(regx_pmc) > -1 ):true) &&
      (human!=false?(obj.species == "taxonomy:9606"):true) &&
      (search!= null?(obj.sentence.search(regx_search) > -1 ):true) &&
      (hypo!=null?(obj.hypothesis === hypo):true) &&
      (negInfo!=null?(obj.negInfo === negInfo):true)
    )
  }  
  handleFilter = () => {
    const {pmc,hypo,negInfo,human,search} = this.refs
    console.log(this.refs)
    this.setState(
      {
        pmc: pmc.value.length>1?pmc.value:null,
        human: human.checked,
        search: search.value.length>2?search.value:null,
        hypo: hypo.value=="0"?null:(hypo.value=="2"?true:false),
        negInfo: negInfo.value=="0"?null:(negInfo.value=="2"?true:false)
      }
    )
  }
  render() {
    const articles = this.props.data.articles
    const identifier = this.props.identifier
    var array = []
    let highlightedHTML
    articles.map(article => {
      return article.evidence.map(sentence => {
        highlightedHTML = this.highlighter(sentence, article, identifier)
        if (highlightedHTML == null || sentence.length < 50) return
        let species
        try {
          species = article.extracted_information.context.Species
        } catch {
          species = null
        }
        array.push({
          hypothesis: article.extracted_information.hypothesis_information,
          negInfo: article.extracted_information.negative_information,
          species: species,
          sentence: sentence,
          pmcid: article.pmc_id,
          html: highlightedHTML,
        })
      })
    })
    let htmlArray = []
    let unique = array.filter((item, pos) => {
        if(htmlArray.indexOf(item.html) == -1){
          htmlArray.push(item.html)
          return true
        }
        else 
          return false
      }
    )

    if (unique.length === 0) {
      return <p style={{ textAlign: "center" }}>No Sentence Found</p>
    }
    let dispArr = unique.filter(this.filterFunction)
    return (
      <table className="w-100">
        <thead>
          <tr>
            <td colSpan="5">
              <div className="form-row my-auto">
                <div className="col-2 col-sm-2 mt-2">
                  <input className="form-control form-control-sm" type="text" placeholder="PMC ID" ref="pmc" onChange = {this.handleFilter} />
                </div>
                <div className="col-sm-2 col-3 mt-2">
                  <select className="form-control form-control-sm" ref="hypo" onChange = {this.handleFilter} >                    
                    <option hidden value="0">Hypothesis Information</option>
                    <optgroup label="Hypothesis Information">
                      <option value="2">True</option>
                      <option value="1">False</option>
                      <option value="0">All</option>
                    </optgroup>
                  </select>
                </div>
                <div className="col-sm-2 col-3 mt-2">
                  <select className="form-control form-control-sm" ref="negInfo" onChange = {this.handleFilter} >
                    <option hidden value="0">Negative Information</option>
                    <optgroup label="Negative Information">
                      <option value="2">True</option>
                      <option value="1">False</option>
                      <option value="0">All</option>
                    </optgroup>
                  </select>
                </div>
                <div className="col-sm-1 col-4">
                  <div className="form-check form-check-inline">
                    <label className="form-check-label col-form-label-sm py-0" htmlFor="human">Human only</label> &emsp;
                    <input className="form-check-input form-control-sm" type="checkbox" id="human" ref="human" onChange = {this.handleFilter} />                  
                  </div>
                </div>
                <div className="col mt-2">
                  <input className="form-control form-control-sm" type="text" placeholder="Search by keyword" ref="search" onChange = {this.handleFilter} />
                </div>
              </div>
            </td>
          </tr>
        </thead>
        <tbody className={[this.props.className, style.sentenceTable].join(" ")}>
          {
          dispArr.length==0?<tr>
                              <th>
                                No Results Found, please refine your filter.
                              </th>
                            </tr>
          :dispArr.map(obj => {
            return (
              <tr key={obj.html}>
                <th>
                  <a
                    title="Link to PMC"
                    href={`https://www.ncbi.nlm.nih.gov/pmc/articles/PMC${
                      obj.pmcid
                    }?text=${encodeURIComponent(obj.sentence)}`}
                    target="_blank"
                    onClick={() =>
                      this.setCookieOnPmcLinkClick(obj.pmcid, obj.sentence)
                    }
                  >
                    <i className="fa fa-file-text-o" aria-hidden="true" />
                  </a>
                </th>
                <th>
                  {obj.hypothesis ? (
                    <i
                      title="True Hypothesis"
                      className="fa fa-star-half-o"
                      aria-hidden="true"
                    />
                  ) : (
                    <i
                      title="False Hypothesis"
                      className="fa fa-star"
                      aria-hidden="true"
                    />
                  )}
                </th>
                <th>{obj.negInfo?<i title="Negative Information" className="fa fa-minus-circle" />:<i className="fa fa-minus-circle invisible" />}</th>
                <th>{obj.species=="taxonomy:9606"?<i title="Human" className="fa fa-male" />:<i className="fa fa-male invisible" />}</th>
                <td>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: obj.html,
                    }}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
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
    )
  }
}

export default SentenceView
