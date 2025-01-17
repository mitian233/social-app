import React from 'react'
import {View} from 'react-native'
import {msg} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {isNative} from '#/platform/detection'
import {useTheme, atoms as a, useBreakpoints} from '#/alf'
import {Text} from '#/components/Typography'
import {Button, ButtonColor, ButtonText} from '#/components/Button'

import * as Dialog from '#/components/Dialog'

export {useDialogControl as usePromptControl} from '#/components/Dialog'

const Context = React.createContext<{
  titleId: string
  descriptionId: string
}>({
  titleId: '',
  descriptionId: '',
})

export function Outer({
  children,
  control,
  testID,
}: React.PropsWithChildren<{
  control: Dialog.DialogOuterProps['control']
  testID?: string
}>) {
  const {gtMobile} = useBreakpoints()
  const titleId = React.useId()
  const descriptionId = React.useId()

  const context = React.useMemo(
    () => ({titleId, descriptionId}),
    [titleId, descriptionId],
  )

  return (
    <Dialog.Outer control={control} testID={testID}>
      <Context.Provider value={context}>
        <Dialog.Handle />

        <Dialog.ScrollableInner
          accessibilityLabelledBy={titleId}
          accessibilityDescribedBy={descriptionId}
          style={[gtMobile ? {width: 'auto', maxWidth: 400} : a.w_full]}>
          {children}
        </Dialog.ScrollableInner>
      </Context.Provider>
    </Dialog.Outer>
  )
}

export function Title({children}: React.PropsWithChildren<{}>) {
  const {titleId} = React.useContext(Context)
  return (
    <Text nativeID={titleId} style={[a.text_2xl, a.font_bold, a.pb_sm]}>
      {children}
    </Text>
  )
}

export function Description({children}: React.PropsWithChildren<{}>) {
  const t = useTheme()
  const {descriptionId} = React.useContext(Context)
  return (
    <Text
      nativeID={descriptionId}
      style={[a.text_md, a.leading_snug, t.atoms.text_contrast_high, a.pb_lg]}>
      {children}
    </Text>
  )
}

export function Actions({children}: React.PropsWithChildren<{}>) {
  const {gtMobile} = useBreakpoints()

  return (
    <View
      style={[
        a.w_full,
        a.gap_sm,
        a.justify_end,
        gtMobile
          ? [a.flex_row, a.flex_row_reverse, a.justify_start]
          : [a.flex_col],
        isNative && [a.pb_4xl],
      ]}>
      {children}
    </View>
  )
}

export function Cancel({
  children,
  cta,
}: React.PropsWithChildren<{
  /**
   * Optional i18n string, used in lieu of `children` for simple buttons. If
   * undefined (and `children` is undefined), it will default to "Cancel".
   */
  cta?: string
}>) {
  const {_} = useLingui()
  const {gtMobile} = useBreakpoints()
  const {close} = Dialog.useDialogContext()
  const onPress = React.useCallback(() => {
    close()
  }, [close])

  return (
    <Button
      variant="solid"
      color="secondary"
      size={gtMobile ? 'small' : 'medium'}
      label={cta || _(msg`Cancel`)}
      onPress={onPress}>
      {children ? children : <ButtonText>{cta || _(msg`Cancel`)}</ButtonText>}
    </Button>
  )
}

export function Action({
  children,
  onPress,
  color = 'primary',
  cta,
  testID,
}: React.PropsWithChildren<{
  onPress: () => void
  color?: ButtonColor
  /**
   * Optional i18n string, used in lieu of `children` for simple buttons. If
   * undefined (and `children` is undefined), it will default to "Confirm".
   */
  cta?: string
  testID?: string
}>) {
  const {_} = useLingui()
  const {gtMobile} = useBreakpoints()
  const {close} = Dialog.useDialogContext()
  const handleOnPress = React.useCallback(() => {
    close()
    onPress()
  }, [close, onPress])

  return (
    <Button
      variant="solid"
      color={color}
      size={gtMobile ? 'small' : 'medium'}
      label={cta || _(msg`Confirm`)}
      onPress={handleOnPress}
      testID={testID}>
      {children ? children : <ButtonText>{cta || _(msg`Confirm`)}</ButtonText>}
    </Button>
  )
}

export function Basic({
  control,
  title,
  description,
  cancelButtonCta,
  confirmButtonCta,
  onConfirm,
  confirmButtonColor,
}: React.PropsWithChildren<{
  control: Dialog.DialogOuterProps['control']
  title: string
  description: string
  cancelButtonCta?: string
  confirmButtonCta?: string
  onConfirm: () => void
  confirmButtonColor?: ButtonColor
}>) {
  return (
    <Outer control={control} testID="confirmModal">
      <Title>{title}</Title>
      <Description>{description}</Description>
      <Actions>
        <Action
          cta={confirmButtonCta}
          onPress={onConfirm}
          color={confirmButtonColor}
          testID="confirmBtn"
        />
        <Cancel cta={cancelButtonCta} />
      </Actions>
    </Outer>
  )
}
