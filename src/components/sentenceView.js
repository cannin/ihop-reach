import React from "react"

class SentenceView extends React.Component {

    highlight = (sentence,data) => {
        if(data === undefined)
            return sentence

        if(data.trigger !== undefined){
            data.entity_type = "trigger"
            data.entity_text = data.trigger
        }

        const color = {
            "celltype" : "#e9b54d",
            "cellular_component" : "#85b6d8",
            "family" : "#7a1199",
            "organ" : "#fc751b",
            "protein" : "#dd103e",
            "simple_chemical" : "#cf7d8a",
            "site" : "#85b6d8",
            "species" : "#15407a",
            "trigger" : "#f00"
        }
        let words = sentence.split(" ")
        let word
        let newSentence = []
        let newWord
        for (let i =0;i<words.length;i++) {
            word = words[i]
            console.log(word)            
            if(word === data.entity_text){
                newWord = `<span style="color:${color[data.entity_type]}"><b>${word}</b></span>`
            }
            else {
                newWord = word
            }
            newSentence.push(newWord)
        }
        console.log(newSentence)
        return newSentence.join(" ")
    }
    highlightSentence = (sentence) => {
        const data = this.props.data.extracted_information
        return this.highlight(this.highlight(this.highlight(sentence,this.props.data),data.participant_a),data.participant_b)
    }
    render() {
        return (
            <tbody className = {this.props.className}>
                {
                    this.props.data.evidence.map(
                        sentence => {
                            return  <tr key={sentence}>
                                        <td>
                                            <span dangerouslySetInnerHTML={{__html:this.highlightSentence(sentence)}}></span> 
                                            &nbsp;  <a href={ "https://www.ncbi.nlm.nih.gov/pmc/articles/" + this.props.data.pmc_id } target="_blank">
                                                        <i class="fa fa-file-text-o" aria-hidden="true"></i>
                                                    </a>
                                        </td>
                                    </tr>
                        }
                    )
                }
            </tbody>
        )
    }
}

export default SentenceView