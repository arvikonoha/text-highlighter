import { Card, Popper, Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

function TextCard({textContent}) {

  const COLOR_MAPPER = ['#eb433b','#96d143', '#90bcc4', '#ffcf4c', '#ff7d45', '#ff7d6c']

  const [annotationShown, setAnnotation] = useState(false);
  const [currentSelectedParagraph, changeSelectedParagraph] = useState(null)
  const [annotationStage, changeSelectionStage] = useState(0)
  const [currentTextPostion, updateTextPosition] = useState({x:0,y:0,z:0});
  const [currentAnnotations, updateAnnotationList] = useState([]);

  const removeAnnotation = (annotationToBeRemoved) => {
    return (event) => {
      event.preventDefault()
      updateAnnotationList(
        currentAnnotations.filter(innerAnnotation => innerAnnotation !== annotationToBeRemoved)
      )
    } 
  }

  
  const updateTextAnnotation = (textContent) => {

    const contentArray = textContent.split('\n')
    const annotatedContentArray = contentArray.map((textLine, lineNumber) => {
      const currentAnnotation = currentAnnotations.filter(annotation => annotation.z === lineNumber)
        .sort((a, b) => a.x - b.x)
      const trimmedText = textLine.trim();

      if(currentAnnotation.length) {

        const lineAnnotations = currentAnnotation.reduce((previousValue, currentValue) => {
          
          if(previousValue.length === 0 && currentValue.x !==0 ){
            previousValue.push([0, currentValue.x])
            previousValue.push([currentValue.x, currentValue.y])
          } else {
            if(previousValue[previousValue.length-1]) {
              previousValue.push([previousValue[previousValue.length-1][1], currentValue.x])
            }
            previousValue.push([currentValue.x, currentValue.y])
          }

          return previousValue
        }, [])

        lineAnnotations.push([lineAnnotations[lineAnnotations.length-1][1], textLine.length])

        /* Create pairs of indices, map them */

      return <p data-line={lineNumber} key={lineNumber}>
        {
          lineAnnotations.map((indexPair) => {
            const immediateAnnotation = currentAnnotation.find(annotation => annotation.x === indexPair[0])

            if(immediateAnnotation) {
              return <span onContextMenu={removeAnnotation(immediateAnnotation)} key={indexPair} data-part={immediateAnnotation.x} className="annotated" style={{backgroundColor:immediateAnnotation.color}}>{trimmedText.slice(indexPair[0], indexPair[1])}</span>
            } else {
              return <span key={indexPair} data-part={indexPair[0]}>{trimmedText.slice(indexPair[0], indexPair[1])}</span>
            }
          })
        }
        </p>;
      }
      return <p data-line={lineNumber} key={lineNumber}>{trimmedText}</p>
    })
    return annotatedContentArray
  }


  const onSelectText = (event) => {

    const someTextSelected = window.getSelection().toString().trim().length > 0
    const sameNodeTextSelection = window.getSelection().anchorNode === window.getSelection().focusNode

    if(someTextSelected && sameNodeTextSelection && event.target) {
      const closestStartSpan = window.getSelection().focusNode.parentNode.closest('span')
      const closestEndSpan = window.getSelection().anchorNode.parentNode.closest('span')

      let textStartIndex = window.getSelection().anchorOffset
      let textEndIndex = window.getSelection().focusOffset

      if(closestStartSpan) {
        textStartIndex += Number(closestStartSpan.dataset.part)
      }

      if(closestEndSpan) {
        textEndIndex += Number(closestEndSpan.dataset.part)
      }


      const textLine = Number(window.getSelection().focusNode.parentNode.closest('p').dataset.line)

      updateTextPosition({x: textStartIndex, y: textEndIndex, z: textLine})

      changeSelectedParagraph(window.getSelection().focusNode.parentNode)
      setAnnotation(true)
    } else {
      setAnnotation(false)
    }

    /* There must be some text selected */
    /* Make sure the selection lies in the same paragraph */
      /* Then follow up with the prompt to annotation */
  }

  const startAnnotation = () => {
    changeSelectionStage(1);
  }

  const colorPressed = (colorSelected) => {
    return () => {
      updateAnnotationList([...currentAnnotations, {...currentTextPostion, color: colorSelected}])
      changeSelectionStage(0)
    }
  }

  return <Card className="textArea" onMouseMove={onSelectText} sx={{m: 8, p: 8}}>{updateTextAnnotation(textContent)}
    <Popper open={annotationShown} anchorEl={currentSelectedParagraph} placement={"right"}>
      <Box sx={{ border: 1, p: 1, backgroundColor: 'white' }}>
        {
          annotationStage === 0 ? 
          <Button onClick={startAnnotation} style={{color: "black"}} >Start annotating</Button> : 
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Box onClick={colorPressed(COLOR_MAPPER[0])} sx={{ p: 2, background: COLOR_MAPPER[0] }}></Box>
            </Grid>
            <Grid item xs={3}>
              <Box onClick={colorPressed(COLOR_MAPPER[1])} sx={{ p: 2, background: COLOR_MAPPER[1] }}></Box>
            </Grid>
            <Grid item xs={3}>
              <Box onClick={colorPressed(COLOR_MAPPER[2])} sx={{ p: 2, background: COLOR_MAPPER[2] }}></Box>
            </Grid>
            <Grid item xs={3}>
              <Box onClick={colorPressed(COLOR_MAPPER[3])} sx={{ p: 2, background: COLOR_MAPPER[3] }}></Box>
            </Grid>
            <Grid item xs={3}>
              <Box onClick={colorPressed(COLOR_MAPPER[4])} sx={{ p: 2, background: COLOR_MAPPER[4] }}></Box>
            </Grid>
            <Grid item xs={3}>
              <Box onClick={colorPressed(COLOR_MAPPER[5])} sx={{ p: 2, background: COLOR_MAPPER[5] }}></Box>
            </Grid>
          </Grid>
        }
      </Box>
    </Popper>
  </Card>;
}

export default TextCard;