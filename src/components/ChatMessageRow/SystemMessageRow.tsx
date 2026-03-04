import { Message, SystemMessageData } from '../../store/slices/messagesSlice';
import { getNormalizedSystemMessage } from '../../utils/systemMessageUtils';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { SystemMessage } from './SystemMessage';

type SystemMessageRowProps = {
  message: Message;
};

function getDisplayText(
  text: string,
  systemMessageData: SystemMessageData,
  t: TFunction,
): string {
  switch (systemMessageData.type) {
    case 'CreatedRoom':
      return systemMessageData.roomName
        ? t('systemMessage.createdRoomWithName', {
            name: systemMessageData.roomName,
          })
        : t('systemMessage.createdRoom');
    case 'AddedMember':
      return systemMessageData.memberName
        ? t('systemMessage.addedMemberWithName', {
            name: systemMessageData.memberName,
          })
        : t('systemMessage.addedMember');
    case 'RemoveMember':
      return systemMessageData.memberName
        ? t('systemMessage.removedMemberWithName', {
            name: systemMessageData.memberName,
          })
        : t('systemMessage.removedMember');
    case 'Other':
    default:
      return text;
  }
}

export function SystemMessageRow({ message }: SystemMessageRowProps) {
  const { t } = useTranslation();
  const { text, systemMessageData } = getNormalizedSystemMessage(message);

  const displayText = getDisplayText(text, systemMessageData, t);

  return <SystemMessage displayText={displayText} />;
}
