# StartPage ���� �� �� ���

## TODO
1. StartPage ��������
   - [ ] īī���� ��ũ ���� �׽�Ʈ ��ư ���� (������ ��ư ����)

2. LinkInPage ��������
   - [ ] isValid ���� ������ ���� Link Type�� �°� ����
   - [ ] ����� �ӽ÷� "��ũ" �ؽ�Ʈ ���� ���ηθ� �Ǵ� ��
   - [ ] ���� ��ȿ�� ���� ��ũ �������� ���� ���� ���� �ʿ� 

3. KakaoInPage ��������
   - [ ] �ӽ� ������(familyName, userName) ����
   - [ ] API �����Ͽ� ���� ���� �� ����� ���� �޾ƿ���
   - [ ] ���� �ڵ� ���� ���� ���� 

4. MakeConfirmPage ��������
   - [x] �ӽ� �׽�Ʈ�� ������ ����
     - userName: ����� ��κ� �ٸ� ���� ������ ���
       - FirstMakePage �����: "���θ�����"
       - LinkInPage �����: "��ũ������"
     - familyName: FirstMakePage���� �Է��� �� �Ǵ� ���� ������ ���
   - [ ] API ����
     - [ ] userName: �鿣�忡�� ȸ�� ���� �޾ƿ���
     - [ ] familyName: FirstMakePage���� �Է��� �� �Ǵ� LinkInPage ���� �� �鿣�忡�� ���� ���� �޾ƿ���
   - [x] ����� ��κ� �ٸ� �޽��� ǥ�� ����
     - FirstMakePage: "[userName]���� [familyName]�� �����Դϴ�."
     - LinkInPage: "[userName]���� ���� [familyName]�� �����մϴ�."

## ���� ��
### MakeConfirmPage ������ �帧
1. userName
   - ����: ����� ��ο� ���� �ٸ� ���� ������ ���
     - FirstMakePage���� �� ���: "���θ�����"
     - LinkInPage���� �� ���: "��ũ������"
   - ����: ȸ������ �� �Է��� �̸��� �鿣�忡�� �޾ƿ�

2. familyName
   - FirstMakePage �����: state�� ���޹��� familyName ���
   - LinkInPage �����: "�׽�Ʈ�밡���̸�" (�ӽ�) �� ���� �鿣�忡�� ���� ���� �޾ƿ� 

3. �޽��� ǥ��
   - FirstMakePage �����: "[userName]���� [familyName]�� �����Դϴ�."
   - LinkInPage �����: "[userName]���� ���� [familyName]�� �����մϴ�." 