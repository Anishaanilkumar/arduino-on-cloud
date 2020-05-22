import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
// import AddSideBarComponentDOM from './Helper/SidebarDom.js'
import {
  Hidden,
  List,
  ListItem,
  Collapse,
  ListItemText,
  ListItemIcon
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import './Helper/SchematicEditor.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLibraries, toggleCollapse, fetchComponents } from '../../redux/actions/index'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'
import Popover from '@material-ui/core/Popover'
const COMPONENTS_PER_ROW = 3

const useStyles = makeStyles((theme) => ({
  toolbar: {
    minHeight: '90px'
  },
  nested: {
    paddingLeft: theme.spacing(2),
    width: '100%'
  },
  head: {
    marginRight: 'auto'
  }
}))

export default function ComponentSidebar ({ compRef }) {
  const classes = useStyles()
  const libraries = useSelector(state => state.schematicEditorReducer.libraries)
  const collapse = useSelector(state => state.schematicEditorReducer.collapse)
  const components = useSelector(state => state.schematicEditorReducer.components)

  const dispatch = useDispatch()

  const handleCollapse = (id) => {
    console.log('Current: ', collapse[id], components[id].length)

    // Fetches Components for given library if not already fetched
    if (collapse[id] === false && components[id].length === 0) {
      console.log('Components not fetched earlier, fetching.')
      dispatch(fetchComponents(id))
    }

    // Updates state of collapse to show/hide dropdown
    dispatch(toggleCollapse(id))
    console.log(collapse)
  }

  // For Fetching Libraries
  useEffect(() => {
    dispatch(fetchLibraries())
  }, [dispatch])

  // Used to chunk array
  const chunk = (array, size) => {
    return array.reduce((chunks, item, i) => {
      if (i % size === 0) {
        chunks.push([item])
      } else {
        chunks[chunks.length - 1].push(item)
      }
      return chunks
    }, [])
  }

  // Generates Component Listing and It's Pop Over
  const generateComponent = (component) => {
    return (
      <PopupState variant="popover" popupId={component.full_name}>
        {popupState => (
          <div>
            <ListItemIcon key={component.full_name} {...bindTrigger(popupState)}>
              <img src={'../' + component.svg_path} alt="Component"/>
            </ListItemIcon>

            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'left'
              }}
            >
              <List component="div" disablePadding dense >
                <ListItemText>
                  <b>Description:</b> {component.description}
                </ListItemText>

                <ListItemText>
                  <b>Keywords:</b> {component.keyword}
                </ListItemText>

                <ListItemText>
                  <b>Datasheet:</b> <a href={component.data_link}>{component.data_link}</a>
                </ListItemText>

                <ListItemText>
                  <b>DMG:</b> {component.dmg}  <b> Part: </b> {component.part}
                </ListItemText>
              </List>
            </Popover>
          </div>
        )}
      </PopupState>
    )
  }

  return (
    <>
      <Hidden smDown>
        <div className={classes.toolbar} />
      </Hidden>

      {/* Display List of categorized components */}
      <List>
        <ListItem button divider>
          <h2 style={{ margin: '5px' }}>Components List</h2>
        </ListItem>

        {/* Collapsing List Mapped by Libraries fetched by the API */}
        {
          libraries.map(
            (library) => {
              return (
                <div key={library.id}>
                  <ListItem onClick={(e, id = library.id) => handleCollapse(id)} button divider>
                    <span className={classes.head}>{library.library_name}</span>
                    {collapse[library.id] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={collapse[library.id]} timeout={'auto'} unmountOnExit mountOnEnter exit={false}>
                    <List component="div" disablePadding dense >

                      {/* Chunked Components of Library */}
                      {
                        chunk(components[library.id], COMPONENTS_PER_ROW).map((componentChunk) => {
                          return (
                            <ListItem key={componentChunk[0].svg_path} divider>
                              {
                                componentChunk.map((component) => {
                                  console.log(component)
                                  return (<ListItemIcon key={component.component_name}>
                                    {generateComponent(component)}
                                  </ListItemIcon>)
                                }
                                )
                              }
                            </ListItem>
                          )
                        })
                      }

                    </List>
                  </Collapse>
                </div>
              )
            }
          )
        }

        <ListItem>
          <div ref={compRef}>
          </div>
        </ListItem>
      </List>
    </>
  )
}

ComponentSidebar.propTypes = {
  compRef: PropTypes.object.isRequired
}
