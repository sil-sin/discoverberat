import React, { useState } from 'react'
import { renderIcon } from './iconHelperFunction'
import styles from './IconPicker.module.css'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

const iconNames = [
  'MdAccountBalance',
  'MdAccessible',
  'MdBookmarkBorder',
  'MdBookmarkAdded',
  'MdBookmarkRemove',
  'MdBookmarkAdd',
  'MdBrowseGallery',
  'MdCalendarMonth',
  'MdBuildCircle',
  'MdCommute',
  'MdCurrencyExchange',
  'MdDelete',
  'MdDone',
  'MdEco',
  'MdFavorite',
  'MdExplore',
  'MdFilterListAlt',
  'MdFreeCancellation',
  'MdHelpOutline',
  'MdHelp',
  'MdGTranslate',
  'MdHomeFilled',
  'MdHttps',
  'MdLanguage',
  'MdManageAccounts',
  'MdPaid',
  'MdPermMedia',
  'MdReportProblem',
  'MdRoom',
  'MdRowing',
  'MdVisibility',
  'MdVisibilityOff',
  'MdBusiness',
  'MdCall',
  'MdChat',
  'MdEmail',
  'MdLocationOn',
  'MdLiveHelp',
  'MdSwapCalls',
  'MdVpnKey',
  'MdInbox',
  'MdSend',
  'MdWaves',
  'MdWeekend',
  'MdInsertInvitation',
  'MdInsertPhoto',
  'MdModeEditOutline',
  'MdCloudySnowing',
  'MdFoggy',
  'MdArrowForward',
  'MdCameraAlt',
  'MdMuseum',
  'MdMosque',
  'MdSailing',
  'MdEast',
  'MdNorthEast',
  'MdNorthWest',
  'MdNorth',
  'MdSouthEast',
  'MdSouthWest',
  'MdSouth',
  'MdWest',
  'MdAirlineSeatIndividualSuite',
  'MdDriveEta',
  'MdAirportShuttle',
  'MdNoPhotography',
  'MdWheelchairPickup',
  'MdGroups',
  'MdHiking',
  'MdPersonOutline',
  'MdPerson',
  'MdOutlineAddShoppingCart',
  'MdOutlineBookmarkAdd',
  'MdOutlineBookmarkAdded',
  'MdOutlineBookmarkBorder',
  'MdOutlineBookmarkRemove',
  'MdOutlineBookmarks',
  'MdOutlineCommute',
  'MdOutlineCompareArrows',
  'MdOutlineEuroSymbol',
  'MdOutlineFilterAlt',
  'MdOutlineNotAccessible',
  'MdOutlineRemoveShoppingCart',
  'MdOutlineChat',
]

function IconSelector() {
  const [selectedIcon, setSelectedIcon] = useState('')
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen)
  }

  const selectIcon = (iconName: any) => {
    setSelectedIcon(iconName)
    toggleDropdown()
  }

  return (
    <div className={styles.container}>
      <p>Selected Icon:</p>
      <div className={styles.dropdown}>
        <div className={styles.dropdownButton} onClick={toggleDropdown}>
          {selectedIcon ? selectedIcon : <input type='search' />}
          {isDropdownOpen ? (
            <MdKeyboardArrowUp size={24} />
          ) : (
            <MdKeyboardArrowDown size={24} />
          )}
        </div>
        {isDropdownOpen && (
          <div className={styles.dropdownContent}>
            {iconNames.map((icon) => (
              <div
                key={icon}
                className={styles.dropdownItem}
                onClick={() => selectIcon(icon)}
              >
                {icon} - {renderIcon(icon)}
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedIcon && (
        <div>
          <p>Preview:</p>
          {renderIcon(selectedIcon)}
        </div>
      )}
    </div>
  )
}

export default IconSelector
