import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faDirections } from '@fortawesome/free-solid-svg-icons';
import { isAndroid } from 'react-device-detect';

import './MobileTrackInfo.css';

class MobileTrackInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      width : innerWidth - 50,
    }
  }

  componentDidMount() {
    window.addEventListener('orientationchange', this.onOrientationChange);
  }

  componentWillUnmount() {
    window.removeEventListener('orientationchange', this.onOrientationChange);
  }

  onOrientationChange = (e) => {
    this.setState({ width : innerWidth - 50 })
  }

  openTrackEmail = () => {
    const { track } = this.props;

    if (track && track.email) {
      window.open(`mailto:${track.email}`);
    }
  }

  openTrackUrl = () => {
    const { track } = this.props;

    if (track && track.website_url) {
      if (window.cordova) {
        if (isAndroid) {
          cordova.InAppBrowser.open(track.website_url);
        } else {
          cordova.InAppBrowser.open(track.website_url, '_blank', { usewkwebview : 'yes' });
        }
      } else {
        window.open(track.website_url, '_new');
      }
    }
  }

  openTrackPhone = () => {
    const { track } = this.props;

    if (track) {
      const phone_number = track.primary_contact_phone || track.phone_number;

      if (phone_number) {
        if (window.cordova) {

        } else {
          // window.open("tel:+4842566",'_blank');
        }
      }
    }
  }

  navigateTo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { track } = this.props;

    if (window.cordova) {
      directions.navigateTo(track.position.lat, track.position.lng);
    } else {
      const link = document.createElement('a');
      link.href = `geo:${track.position.lat},${track.position.lng}`;
      link.click();
      link.remove();
    }
  }

  render() {
    const { openTrackEmail, openTrackUrl, navigateTo, openTrackPhone } = this;
    const { app, track } = this.props;
    const { width } = this.state;

    const style = {
      top : window.cordova ? '35px' : '25px',
      width : `${width}px`
    }

    return (
      <div className={`mobile-track-info ${track ? 'show' : 'hide'} ${this.props.searchMode} ${isAndroid ? 'android' : ''}`} style={{ width : `${width}px`}} style={style}>
        <div className="close" onClick={(e) => app.setActiveTrack(undefined)}><FontAwesomeIcon icon={faTimes} /></div>
        <div className="get-directions" onClick={navigateTo}>
          <FontAwesomeIcon icon={faDirections} />
        </div>
        {track && <div className="detail-layout">
          <div className="district-container"><div className="district">{track.district}</div></div>
          <div className="details">
            <div className="trackname" onClick={openTrackUrl}><span style={{ display : 'block' }}>{track.name}</span></div>
            <div className="state">{track.state}</div>
            <div className="operator">{track.primary_contact_name}</div>
            <div className="phone" onClick={openTrackPhone}>{track.primary_contact_phone || track.phone_number}</div>
            <div className="email" onClick={openTrackEmail}>{track.email}</div>
            <div className="url" onClick={openTrackUrl}>{track.website_url}</div>
          </div>
        </div>}
      </div>
  	);
  }
}

export default MobileTrackInfo;
