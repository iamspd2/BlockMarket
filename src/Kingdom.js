import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { UserSession } from 'blockstack'
import { jsonCopy, subjectFromKingdomUrl,
  loadRuler, loadSubjects, resolveSubjects } from './utils'
import Subject from './Subject'
import { appConfig, SUBJECTS_FILENAME, EXPLORER_URL } from './constants'

import './Kingdom.css'

class Kingdom extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ruler: {
        animal: {

        },
        territory: {

        }
      },
      subjects: [],
      value: '',
      app:`${props.protocol}//${props.realm}`,
      rulerUsername: props.ruler,
      clickAdd: false
    }
    this.userSession = new UserSession({ appConfig })
    this.addSubject = this.addSubject.bind(this)
    this.removeSubject = this.removeSubject.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.loadKingdom = this.loadKingdom.bind(this)
  }

  componentWillMount() {
    const app = this.state.app
    const ruler = this.props.ruler
    this.loadKingdom(ruler, app)
    const search = window.location.search
    if(search) {
      const appUrl = search.split('=')[1]
      this.setState({
        value: appUrl,
        clickAdd: true
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextSubjects = nextProps.subjects
    if(nextSubjects) {
      if (nextSubjects.length !== this.state.subjects.length) {
        this.setState({ subjects: jsonCopy(nextSubjects) })
      }
      resolveSubjects(this, this.userSession, nextSubjects)
    }
  }


  handleChange(event) {
   this.setState({value: event.target.value});
  }

  loadKingdom(ruler, app) {
    loadRuler(this.userSession, ruler, app)
    .then(ruler => {
      if (ruler) {
        this.setState({ ruler })
      }
    })

    loadSubjects(this.userSession, ruler, app)
    .then(subjects => {
      this.setState({ subjects })
      resolveSubjects(this, this.userSession, subjects)
    })
  }

  addSubject(e) {
    e.preventDefault()
    const subject = subjectFromKingdomUrl(this.state.value)
    const subjects = jsonCopy(this.state.subjects)
    this.setState({value: '', clickAdd: false})
    subjects.push(subject)
    this.setState({ subjects })
    this.saveSubjects(subjects)
  }

  removeSubject(e, index) {
    e.preventDefault()
    const subjects = jsonCopy(this.state.subjects)
    subjects.splice(index, 1) // remove subject at index
    this.setState({ subjects })
    this.saveSubjects(subjects)
  }

  saveSubjects(subjects) {
    const options = { encrypt: false }
    this.userSession.putFile(SUBJECTS_FILENAME, JSON.stringify(subjects), options)
    .finally(() => {
      if(window.location.search) {
        window.history.pushState(null, "", window.location.href.split("?")[0])
      }
      resolveSubjects(this, this.userSession, subjects)
    })
  }

  render() {
    const mine = this.props.myKingdom
    const ruler = this.state.ruler
    const rulerAnimal = ruler.animal
    const rulerTerritory = ruler.territory
    const username = this.state.rulerUsername
    const subjects = this.state.subjects
    const myKingdom = this.props.myKingdom
    const app = this.state.app
    const clickAdd = this.state.clickAdd
    const currentUsername = this.props.currentUsername
    return (
      <div className="Kingdom">
        <div className="row">
          <div
            className="col-lg-12 territory"
          >
          { rulerAnimal && rulerAnimal.name ?
            <img className="rounded-circle" src={`https://www.ebuyer.com/blog/wp-content/uploads/2013/11/bitcoin-logo-1000_0.jpg`} alt={rulerAnimal.name} />
            :
            <img className="rounded-circle" src="https://www.ebuyer.com/blog/wp-content/uploads/2013/11/bitcoin-logo-1000_0.jpg"
            alt="The Ruler" />
          }
          </div>
        </div>
        <div className="row ruler">
          <div className="col-lg-12">
            <h2>{username} is registered as a BlockMarket customer</h2>
            {rulerAnimal ?
              <p><a href={`${EXPLORER_URL}/name/${username}`} target="_blank" rel="noopener noreferrer">{username}</a> BlockMarket</p>
              :
              <p>{username} is registered as a BlockMarket customer</p>
            }
            <p>
            {mine ? <Link className="btn btn-primary" to="/me" role="button">Show Offers</Link>
            : <a
              className='btn btn-primary'
              href={`${window.location.origin}/kingdom/${currentUsername}?add=${app}/kingdom/${username}`}
            >
            </a>}
            </p>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Kingdom
