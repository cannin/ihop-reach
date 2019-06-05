// @flow

import React from "react"
import ReactDOMServer from "react-dom/server"
type Props = {
  data: Object,
  className: string,
}

class SentenceView extends React.Component<Props> {
  highlight = (sentence: string, data: Object) => {
    if (data === null) return sentence

    try {
      if (data.trigger !== undefined) {
        data.entity_type = "trigger"
        data.entity_text = data.trigger
      }
    } catch (error) {
      console.log(error)
    }

    if (typeof data === "string") {
      var current = data
      data = {}
      data.entity_type = "current"
      data.entity_text = current
    }

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
    if (data.entity_text == null) return sentence
    const regex = new RegExp(
      data.entity_text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    )
    let words = sentence.split(regex)
    let word
    let newSentence = []
    let newWord
    let count = 0
    for (let i = 0; i < words.length; i++) {
      word = words[i]
      if (word == "") {
        newWord = `<span style="cursor:default; color:${
          color[data.entity_type]
        }" title="${data.entity_type.split("_").join(" ")}"><b>${
          data.entity_text
        }</b></span>`
      } else {
        count++
        newWord = word
      }
      newSentence.push(newWord)
    }
    if (count == words.length) return newSentence.join(data.entity_text)
    else return newSentence.join(" ")
  }
  highlightSentence = (sentence: string, data: Object, current: String) => {
    return this.highlight(
      this.highlight(
        this.highlight(this.highlight(sentence, current), data),
        data.extracted_information.participant_a
      ),
      data.extracted_information.participant_b
    )
  }
  render() {
    const articles = this.props.data.articles
    const entity = this.props.entity
    var array = []
    articles.map(article => {
      return article.evidence.map(sentence => {
        array.push(
          ReactDOMServer.renderToStaticMarkup(
            <tr>
              <td style={{ width: "1.5em" }}>
                <a
                  title="Link to PMC"
                  href={
                    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC" +
                    article.pmc_id
                  }
                  target="_blank"
                >
                  <i className="fa fa-file-text-o" aria-hidden="true" />
                </a>
              </td>
              <td>
                <span
                  dangerouslySetInnerHTML={{
                    __html: this.highlightSentence(sentence, article, entity),
                  }}
                />
              </td>
            </tr>,
            "<tbody></tbody"
          )
        )
      })
    })
    var unique = Array.from([...new Set(array)][0])
    return (
      <tbody
        className={this.props.className}
        dangerouslySetInnerHTML={{ __html: unique.join("") }}
      />
    )
  }
}

export default SentenceView
