// @flow

import React from "react"
import { Cookies } from "react-cookie"
import style from "../assets/styles/sentenceView.module.scss"
type Props = {
  data: Object,
  className: string,
}

class SentenceView extends React.Component<Props> {
  highlighter = (sentence: string, data: Object, identifier: string) => {
    const color = {
      celltype: "#e9b54d",
      cellular_component: "#85b6d8",
      family: "#7a1199",
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
    return (
      <tbody className={[this.props.className, style.sentenceTable].join(" ")}>
        {unique.map(obj => {
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
              <th>{obj.negInfo?<i title="Negative Information" className="fa fa-minus-circle" />:""}</th>
              <th>{obj.species=="taxonomy:9606"?<i title="Human" className="fa fa-male" />:""}</th>
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
    )
  }
}

export default SentenceView
