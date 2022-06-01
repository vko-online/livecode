import { Share, Settings, User } from '@carbon/react/icons'
import {
  Theme,
  Header,
  HeaderName,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderPanel,
  NumberInput,
  Select,
  SelectItem,
  Toggle,
  TextInput,
  CopyButton
} from "@carbon/react";
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import MonacoEditor from '../components/MonacoEditor'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../lib/store';
import { setFontSize, setLanguage, setTheme } from '../../lib/store/settingsReducer';
import styles from '../../styles/Editor.module.scss'
import { themes, languages } from '../../lib/data'
import dynamic from 'next/dynamic'
import useShareUrl from '../hooks/useShareUrl'
import { useRef } from 'react';
import Account from './Account'

// const useSharedUrl = dynamic(() => import('../hooks/useShareUrl'), { ssr: false })

type MenuItem = 'setting' | 'share' | 'account'
const HeaderComponent = () => {
  const inputRef = useRef<TextInput>()
  const router = useRouter()
  const { id } = router.query
  const url = useShareUrl(id as string)
  const { language, fontSize, theme } = useSelector((state: RootState) => state.settings)
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState<MenuItem>()
  

  const handleMenuClick = (menuName: MenuItem) => {
    if (menuName === activeTab) {
      setActiveTab(undefined)
    } else {
      setActiveTab(menuName)
    }
  }

  const handleEditorLanguage = (evt) => {
    const val = evt.target.value
    if (language !== val) {
      dispatch(setLanguage(val))
    }
  }

  const handleEditorTheme = async (evt) => {
    const val = evt.target.value
    dispatch(setTheme(val))
  }

  const handleCopy = async () => {
    if (inputRef?.current) {
      // inputRef.current.focus()
      inputRef.current.select()
      inputRef.current.setSelectionRange(0, url.length)
    }
    await navigator.clipboard.writeText(url)
  }
  
  return (
    <Theme theme="g100">
      <Header aria-label="IBM Platform Name">
        <HeaderName href="/" prefix="live">
          [code]
        </HeaderName>
        <HeaderGlobalBar>
          <HeaderGlobalAction
            aria-label="Account"
            isActive={activeTab === 'account'}
            onClick={() => handleMenuClick('account')}
          >
            <User size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Share"
            isActive={activeTab === 'share'}
            onClick={() => handleMenuClick('share')}
          >
            <Share size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction isActive={activeTab === 'setting'} aria-label="Settings" onClick={() => handleMenuClick('setting')}>
            <Settings size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
        <HeaderPanel width="20rem" aria-labelledby='top-menu' aria-label='right-sidebar' expanded={activeTab != null}>
          <div className={styles.settings}>
            {
              activeTab === 'share' && (
                <>
                  <div className={styles.shareLink}>
                    <TextInput
                      type="text"
                      id='editor-url'
                      value={url}
                      ref={inputRef}
                      labelText="Share this URL"
                      onFocus={handleCopy}
                      onClick={handleCopy}
                    />
                    <CopyButton onClick={handleCopy} />
                  </div>
                  <div className={styles.spacer}></div>
                  <Toggle
                    labelText="View only mode"
                    labelA="Off"
                    labelB="On"
                    defaultToggled={false}
                    id="share-editable"
                  />
                </>
              )
            }
            {
              activeTab === 'account' && (
                <Account />
              )
            }
            {
              activeTab === 'setting' && (
                <>
                  <Select
                    defaultValue={language}
                    id='editor-language'
                    labelText="Editor language"
                    onChange={handleEditorLanguage}
                  >
                    {
                      languages.map(l => (
                        <SelectItem  key={l} value={l} text={l} />
                      ))
                    }
                  </Select>
                  <div className={styles.spacer}></div>
                  <Select
                    id='editor-theme'
                    labelText="Editor theme"
                    value={theme} 
                    onChange={handleEditorTheme}
                  >
                    {
                      Object.entries(themes).map(lang => (
                        <SelectItem key={lang[0]} value={lang[0]} text={lang[1]} />
                      ))
                    }
                  </Select>
                  <div className={styles.spacer}></div>
                  <NumberInput
                    invalidText="Number is not valid"
                    label="Editor font size"
                    id='editor-font-size'
                    max={60}
                    min={8}
                    iconDescription='Font size'
                    step={1}
                    onChange={(evt) => dispatch(setFontSize(evt.imaginaryTarget.value))}
                    value={fontSize}
                  />
                </>
              )
            }
          </div>
        </HeaderPanel>
      </Header>
    </Theme>
  )
}

export default HeaderComponent


