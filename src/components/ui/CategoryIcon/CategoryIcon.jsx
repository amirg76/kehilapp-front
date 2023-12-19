import React from 'react'

const CategoryIcon = ({ categoryTitle }) => {
    switch (categoryTitle) {
        case 'ראשי':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M2.42813 10.7122C2.19467 10.7122 1.97077 10.6194 1.80568 10.4544C1.6406 10.2893 1.54785 10.0654 1.54785 9.83191V2.79141C1.54785 2.55795 1.6406 2.33405 1.80568 2.16896C1.97077 2.00388 2.19467 1.91113 2.42813 1.91113H9.47039C9.70385 1.91113 9.92776 2.00388 10.0928 2.16896C10.2579 2.33405 10.3507 2.55795 10.3507 2.79141V9.83191C10.3507 10.0654 10.2579 10.2893 10.0928 10.4544C9.92776 10.6194 9.70385 10.7122 9.47039 10.7122H2.42813ZM14.7521 10.7122C14.5186 10.7122 14.2947 10.6194 14.1296 10.4544C13.9645 10.2893 13.8718 10.0654 13.8718 9.83191V2.79141C13.8718 2.55795 13.9645 2.33405 14.1296 2.16896C14.2947 2.00388 14.5186 1.91113 14.7521 1.91113H21.7926C22.026 1.91113 22.2499 2.00388 22.415 2.16896C22.5801 2.33405 22.6729 2.55795 22.6729 2.79141V9.83191C22.6729 10.0654 22.5801 10.2893 22.415 10.4544C22.2499 10.6194 22.026 10.7122 21.7926 10.7122H14.7521ZM2.42813 23.0361C2.19467 23.0361 1.97077 22.9434 1.80568 22.7783C1.6406 22.6132 1.54785 22.3893 1.54785 22.1559V15.1136C1.54785 14.8801 1.6406 14.6562 1.80568 14.4911C1.97077 14.3261 2.19467 14.2333 2.42813 14.2333H9.47039C9.70385 14.2333 9.92776 14.3261 10.0928 14.4911C10.2579 14.6562 10.3507 14.8801 10.3507 15.1136V22.1559C10.3507 22.3893 10.2579 22.6132 10.0928 22.7783C9.92776 22.9434 9.70385 23.0361 9.47039 23.0361H2.42813ZM14.7521 23.0361C14.5186 23.0361 14.2947 22.9434 14.1296 22.7783C13.9645 22.6132 13.8718 22.3893 13.8718 22.1559V15.1136C13.8718 14.8801 13.9645 14.6562 14.1296 14.4911C14.2947 14.3261 14.5186 14.2333 14.7521 14.2333H21.7926C22.026 14.2333 22.2499 14.3261 22.415 14.4911C22.5801 14.6562 22.6729 14.8801 22.6729 15.1136V22.1559C22.6729 22.3893 22.5801 22.6132 22.415 22.7783C22.2499 22.9434 22.026 23.0361 21.7926 23.0361H14.7521Z" stroke="white" stroke-width="2" />
                </svg>
            )
        case 'חינוך':
            return (
                <svg xmlns='http://www.w3.org/2000/svg' width='21' height='15' viewBox='0 0 21 15' fill='none'>
                    <path d='M19.5003 4.53381L10.3337 0.867142L1.16699 4.53381L10.3337 8.20047L19.5003 4.53381ZM19.5003 4.53381V10.0338' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                    <path d='M4.83398 6.00047V10.9505C4.83398 11.6798 5.41345 12.3793 6.4449 12.895C7.47635 13.4107 8.87529 13.7005 10.334 13.7005C11.7927 13.7005 13.1916 13.4107 14.2231 12.895C15.2545 12.3793 15.834 11.6798 15.834 10.9505V6.00047' stroke='white' strokeWidth='1.5' stroklinecap='round' strokeLinejoin='round' />
                </svg>
            )
        case 'בריאות':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="38" height="32" viewBox="0 0 38 32" fill="none">
                    <path d="M27.2194 30.7909L19.7597 24.0118C15.6438 19.9174 21.6885 12.1134 27.2194 18.5105C32.8794 12.2426 38.7949 20.0439 34.679 24.0118L27.2194 30.7909Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M1.72754 13.628H5.40492L10.309 22.2094L21.3411 1.36914L26.2452 11.1773" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            )
        case 'תרבות':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M9.18002 24.1132C7.69051 23.5646 6.365 22.6462 5.3281 21.4444C4.29121 20.2425 3.577 18.7967 3.25263 17.2428L1.01638 6.72172C0.69307 5.26682 1.62259 3.83886 3.0775 3.52901L16.239 0.740445L16.2794 0.726973C17.7209 0.444075 19.1354 1.3736 19.4317 2.80156L19.9032 5.05128L25.7633 6.30411H25.8037C27.2182 6.62743 28.1342 8.05539 27.8378 9.48335L25.6016 20.0179C25.3435 21.2281 24.8495 22.3755 24.1479 23.3947C23.4462 24.4139 22.5507 25.2849 21.5123 25.958C20.474 26.631 19.3133 27.0929 18.0964 27.3172C16.8796 27.5416 15.6304 27.524 14.4204 27.2655C12.3676 26.8371 10.5204 25.726 9.18002 24.1132ZM25.8037 8.18652L11.9282 5.05128L9.18002 16.6501V16.6905C8.41215 20.3008 11.1838 24.7937 14.8076 25.5615C18.4314 26.3294 22.8522 23.2969 23.6201 19.6731L25.8037 8.18652ZM19.8089 20.1392C19.3833 20.8597 18.742 21.4281 17.9757 21.7641C17.2093 22.1002 16.3568 22.1868 15.5385 22.0117C14.7228 21.8371 13.9819 21.4123 13.4192 20.7965C12.8566 20.1807 12.5001 19.4046 12.3997 18.5765L19.8089 20.1392ZM9.40903 4.44507L3.0775 5.57666L5.3281 16.6905L5.34157 16.7309C5.54364 17.6874 6.62046 19.6822 7.17279 20.4231C7.03808 19.3858 6.94378 17.1755 7.17279 16.0978L7.75206 13.4035C7.14585 13.2957 6.62046 12.959 6.33757 12.474C6.41839 11.6522 7.09196 10.9248 8.02148 10.7092H8.35827L9.40903 5.57666C9.46292 5.3207 9.28779 4.66061 9.40903 4.44507ZM18.5022 14.3869C18.9333 13.6729 19.8493 13.2957 20.7789 13.4978C21.7084 13.6864 22.3819 14.4004 22.5032 15.2356C22.0586 15.9361 21.1561 16.3133 20.2131 16.0978C19.2835 15.9227 18.61 15.2087 18.5022 14.3869ZM11.9282 12.9859C12.3593 12.2719 13.2618 11.8947 14.1914 12.0968C15.0939 12.2854 15.8079 13.0128 15.9157 13.8346C15.4711 14.5351 14.5686 14.9258 13.639 14.7506C12.7095 14.5216 12.0359 13.8077 11.9282 12.9859ZM13.639 3.36736L17.0203 4.44507V2.80156L13.639 3.36736Z" fill="white" />
                </svg>
            )
        case 'טיפולים אלטרנטיבים':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="28" viewBox="0 0 27 28" fill="none">
                    <path d="M25.2179 9.01691C24.5729 7.49238 23.6499 6.12351 22.4749 4.948C21.2993 3.77249 19.9305 2.84953 18.4059 2.205C16.8271 1.53722 15.1508 1.19873 13.4229 1.19873C11.6949 1.19873 10.0182 1.53722 8.43976 2.205C6.91523 2.84997 5.54636 3.77293 4.37085 4.948C3.19534 6.12351 2.27238 7.49238 1.62785 9.01691C0.960073 10.5958 0.621582 12.272 0.621582 14C0.621582 15.728 0.960073 17.4046 1.62785 18.9831C2.27282 20.5076 3.19578 21.8765 4.37085 23.052C5.54636 24.2275 6.91523 25.1505 8.43976 25.795C10.0187 26.4628 11.6949 26.8013 13.4229 26.8013C15.1508 26.8013 16.8275 26.4628 18.4059 25.795C19.9305 25.15 21.2993 24.2271 22.4749 23.052C23.6504 21.8765 24.5733 20.5076 25.2179 18.9831C25.8856 17.4042 26.2241 15.728 26.2241 14C26.2241 12.272 25.8856 10.5954 25.2179 9.01691ZM10.953 25.1408C5.84451 24.0092 2.01238 19.4439 2.01238 14C2.01238 8.18909 6.379 3.37875 12.0031 2.6781C11.8093 2.97449 11.6015 3.31693 11.3963 3.69795C10.964 4.49902 10.6303 5.30885 10.4045 6.10378C10.1173 7.11399 10.0042 8.10491 10.0678 9.04848C10.2081 11.129 11.1902 12.9705 12.9875 14.5226L12.987 14.5231C15.2262 16.4891 15.9146 18.9283 15.0329 21.7721C14.8246 22.4439 14.5497 23.0634 14.2673 23.601C13.6351 24.8032 12.2789 25.4346 10.953 25.1408ZM14.8777 25.3175C15.3692 24.552 15.9541 23.4786 16.3478 22.2268C17.4133 18.841 16.5684 15.8157 13.9047 13.4769L13.9008 13.473C12.3951 12.1738 11.5726 10.6563 11.4564 8.9621C11.3345 7.18239 12.0128 5.49388 12.6034 4.39072C12.6078 4.38239 12.6121 4.37406 12.617 4.36573C13.2549 3.18057 14.6067 2.57067 15.9203 2.86488C21.0148 4.00663 24.8329 8.56529 24.8329 13.9996C24.8325 19.7986 20.4847 24.6006 14.8777 25.3175Z" fill="white" stroke="white" stroke-width="0.8" />
                    <path d="M11.441 22.7967C12.5348 22.7967 13.4215 21.91 13.4215 20.8162C13.4215 19.7224 12.5348 18.8357 11.441 18.8357C10.3472 18.8357 9.46045 19.7224 9.46045 20.8162C9.46045 21.91 10.3472 22.7967 11.441 22.7967Z" fill="white" />
                    <path d="M15.4039 9.16417C16.4977 9.16417 17.3844 8.27746 17.3844 7.18365C17.3844 6.08983 16.4977 5.20312 15.4039 5.20312C14.31 5.20312 13.4233 6.08983 13.4233 7.18365C13.4233 8.27746 14.31 9.16417 15.4039 9.16417Z" fill="white" />
                </svg>
            )
        case 'זכויות':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="21" viewBox="0 0 23 21" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.1104 2.24707H3.11035C2.84513 2.24707 2.59078 2.35243 2.40324 2.53996C2.21571 2.7275 2.11035 2.98185 2.11035 3.24707V17.2471C2.11035 17.5123 2.21571 17.7666 2.40324 17.9542C2.59078 18.1417 2.84513 18.2471 3.11035 18.2471H19.1104C19.3756 18.2471 19.6299 18.1417 19.8175 17.9542C20.005 17.7666 20.1104 17.5123 20.1104 17.2471V3.24707C20.1104 2.98185 20.005 2.7275 19.8175 2.53996C19.6299 2.35243 19.3756 2.24707 19.1104 2.24707ZM3.11035 0.24707C2.3147 0.24707 1.55164 0.563141 0.989031 1.12575C0.426422 1.68836 0.110352 2.45142 0.110352 3.24707V17.2471C0.110352 18.0427 0.426422 18.8058 0.989031 19.3684C1.55164 19.931 2.3147 20.2471 3.11035 20.2471H19.1104C19.906 20.2471 20.6691 19.931 21.2317 19.3684C21.7943 18.8058 22.1104 18.0427 22.1104 17.2471V3.24707C22.1104 2.45142 21.7943 1.68836 21.2317 1.12575C20.6691 0.563141 19.906 0.24707 19.1104 0.24707H3.11035ZM5.11035 5.24707H7.11035V7.24707H5.11035V5.24707ZM10.1104 5.24707C9.84513 5.24707 9.59078 5.35243 9.40324 5.53996C9.21571 5.7275 9.11035 5.98185 9.11035 6.24707C9.11035 6.51229 9.21571 6.76664 9.40324 6.95418C9.59078 7.14171 9.84513 7.24707 10.1104 7.24707H16.1104C16.3756 7.24707 16.6299 7.14171 16.8175 6.95418C17.005 6.76664 17.1104 6.51229 17.1104 6.24707C17.1104 5.98185 17.005 5.7275 16.8175 5.53996C16.6299 5.35243 16.3756 5.24707 16.1104 5.24707H10.1104ZM7.11035 9.24707H5.11035V11.2471H7.11035V9.24707ZM9.11035 10.2471C9.11035 9.98185 9.21571 9.7275 9.40324 9.53996C9.59078 9.35243 9.84513 9.24707 10.1104 9.24707H16.1104C16.3756 9.24707 16.6299 9.35243 16.8175 9.53996C17.005 9.7275 17.1104 9.98185 17.1104 10.2471C17.1104 10.5123 17.005 10.7666 16.8175 10.9542C16.6299 11.1417 16.3756 11.2471 16.1104 11.2471H10.1104C9.84513 11.2471 9.59078 11.1417 9.40324 10.9542C9.21571 10.7666 9.11035 10.5123 9.11035 10.2471ZM7.11035 13.2471H5.11035V15.2471H7.11035V13.2471ZM9.11035 14.2471C9.11035 13.9819 9.21571 13.7275 9.40324 13.54C9.59078 13.3524 9.84513 13.2471 10.1104 13.2471H16.1104C16.3756 13.2471 16.6299 13.3524 16.8175 13.54C17.005 13.7275 17.1104 13.9819 17.1104 14.2471C17.1104 14.5123 17.005 14.7666 16.8175 14.9542C16.6299 15.1417 16.3756 15.2471 16.1104 15.2471H10.1104C9.84513 15.2471 9.59078 15.1417 9.40324 14.9542C9.21571 14.7666 9.11035 14.5123 9.11035 14.2471Z" fill="white" />
                </svg>
            )
        case 'דור צעיר':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" viewBox="0 0 25 23" fill="none">
                    <path d="M15.3644 8.5C15.9611 8.5 16.5334 8.73705 16.9553 9.15901C17.3773 9.58097 17.6144 10.1533 17.6144 10.75V16.999C17.6144 18.458 17.0348 19.8572 16.0031 20.8888C14.9715 21.9204 13.5723 22.5 12.1134 22.5C10.6544 22.5 9.2552 21.9204 8.22356 20.8888C7.19192 19.8572 6.61235 18.458 6.61235 16.999V10.75C6.61235 10.1533 6.8494 9.58097 7.27136 9.15901C7.69332 8.73705 8.26561 8.5 8.86235 8.5H15.3644ZM15.3644 10H8.86235C8.66344 10 8.47267 10.079 8.33202 10.2197C8.19137 10.3603 8.11235 10.5511 8.11235 10.75V16.999C8.11235 18.0601 8.53388 19.0778 9.28422 19.8281C10.0345 20.5785 11.0522 21 12.1134 21C13.1745 21 14.1922 20.5785 14.9425 19.8281C15.6928 19.0778 16.1144 18.0601 16.1144 16.999V10.75C16.1144 10.5511 16.0353 10.3603 15.8947 10.2197C15.754 10.079 15.5633 10 15.3644 10ZM2.36035 8.5H6.51635C6.11487 8.91801 5.83275 9.43598 5.69935 10H2.36035C2.16144 10 1.97067 10.079 1.83002 10.2197C1.68937 10.3603 1.61035 10.5511 1.61035 10.75V15.999C1.61022 16.5008 1.73589 16.9945 1.97588 17.4352C2.21587 17.8758 2.56251 18.2492 2.98409 18.5213C3.40568 18.7934 3.88875 18.9554 4.38913 18.9926C4.8895 19.0297 5.39121 18.9408 5.84835 18.734C5.98135 19.224 6.17235 19.69 6.41235 20.126C5.72722 20.4251 4.97837 20.5489 4.23342 20.4861C3.48847 20.4234 2.77089 20.176 2.14548 19.7665C1.52006 19.3569 1.00651 18.798 0.651205 18.1402C0.295895 17.4825 0.110015 16.7466 0.110352 15.999V10.75C0.110352 10.1533 0.347405 9.58097 0.769362 9.15901C1.19132 8.73705 1.76361 8.5 2.36035 8.5ZM21.8604 8.5C22.4571 8.5 23.0294 8.73705 23.4513 9.15901C23.8733 9.58097 24.1104 10.1533 24.1104 10.75V16C24.1107 16.7472 23.9249 17.4826 23.5699 18.1401C23.2149 18.7975 22.7017 19.3562 22.0768 19.7657C21.4518 20.1752 20.7348 20.4227 19.9903 20.4857C19.2458 20.5488 18.4973 20.4255 17.8124 20.127L17.8684 20.025C18.0824 19.619 18.2554 19.188 18.3794 18.736C18.8362 18.9416 19.3374 19.0295 19.8369 18.9916C20.3365 18.9538 20.8187 18.7914 21.2394 18.5194C21.6601 18.2473 22.006 17.8742 22.2455 17.4341C22.4849 16.9941 22.6104 16.501 22.6104 16V10.75C22.6104 10.5513 22.5315 10.3606 22.391 10.22C22.2506 10.0794 22.0601 10.0003 21.8614 10H18.5284C18.3947 9.43585 18.1122 8.91787 17.7104 8.5H21.8604ZM12.1104 0.5C12.57 0.5 13.0251 0.59053 13.4497 0.766422C13.8744 0.942313 14.2602 1.20012 14.5852 1.52513C14.9102 1.85013 15.168 2.23597 15.3439 2.66061C15.5198 3.08525 15.6104 3.54037 15.6104 4C15.6104 4.45963 15.5198 4.91475 15.3439 5.33939C15.168 5.76403 14.9102 6.14987 14.5852 6.47487C14.2602 6.79988 13.8744 7.05769 13.4497 7.23358C13.0251 7.40947 12.57 7.5 12.1104 7.5C11.1821 7.5 10.2919 7.13125 9.63548 6.47487C8.9791 5.8185 8.61035 4.92826 8.61035 4C8.61035 3.07174 8.9791 2.1815 9.63548 1.52513C10.2919 0.868749 11.1821 0.5 12.1104 0.5ZM20.1134 1.5C20.5073 1.5 20.8974 1.5776 21.2614 1.72836C21.6254 1.87913 21.9561 2.1001 22.2347 2.37868C22.5132 2.65726 22.7342 2.98797 22.885 3.35195C23.0358 3.71593 23.1134 4.10603 23.1134 4.5C23.1134 4.89397 23.0358 5.28407 22.885 5.64805C22.7342 6.01203 22.5132 6.34274 22.2347 6.62132C21.9561 6.8999 21.6254 7.12087 21.2614 7.27164C20.8974 7.4224 20.5073 7.5 20.1134 7.5C19.3177 7.5 18.5546 7.18393 17.992 6.62132C17.4294 6.05871 17.1134 5.29565 17.1134 4.5C17.1134 3.70435 17.4294 2.94129 17.992 2.37868C18.5546 1.81607 19.3177 1.5 20.1134 1.5ZM4.10735 1.5C4.50132 1.5 4.89143 1.5776 5.2554 1.72836C5.61938 1.87913 5.9501 2.1001 6.22867 2.37868C6.50725 2.65726 6.72823 2.98797 6.87899 3.35195C7.02975 3.71593 7.10735 4.10603 7.10735 4.5C7.10735 4.89397 7.02975 5.28407 6.87899 5.64805C6.72823 6.01203 6.50725 6.34274 6.22867 6.62132C5.9501 6.8999 5.61938 7.12087 5.2554 7.27164C4.89143 7.4224 4.50132 7.5 4.10735 7.5C3.3117 7.5 2.54864 7.18393 1.98603 6.62132C1.42342 6.05871 1.10735 5.29565 1.10735 4.5C1.10735 3.70435 1.42342 2.94129 1.98603 2.37868C2.54864 1.81607 3.3117 1.5 4.10735 1.5ZM12.1104 2C11.5799 2 11.0712 2.21071 10.6961 2.58579C10.3211 2.96086 10.1104 3.46957 10.1104 4C10.1104 4.53043 10.3211 5.03914 10.6961 5.41421C11.0712 5.78929 11.5799 6 12.1104 6C12.6408 6 13.1495 5.78929 13.5246 5.41421C13.8996 5.03914 14.1104 4.53043 14.1104 4C14.1104 3.46957 13.8996 2.96086 13.5246 2.58579C13.1495 2.21071 12.6408 2 12.1104 2ZM20.1134 3C19.9164 3 19.7213 3.0388 19.5393 3.11418C19.3573 3.18956 19.192 3.30005 19.0527 3.43934C18.9134 3.57863 18.8029 3.74399 18.7275 3.92597C18.6521 4.10796 18.6134 4.30302 18.6134 4.5C18.6134 4.69698 18.6521 4.89204 18.7275 5.07403C18.8029 5.25601 18.9134 5.42137 19.0527 5.56066C19.192 5.69995 19.3573 5.81044 19.5393 5.88582C19.7213 5.9612 19.9164 6 20.1134 6C20.5112 6 20.8927 5.84196 21.174 5.56066C21.4553 5.27936 21.6134 4.89782 21.6134 4.5C21.6134 4.10218 21.4553 3.72064 21.174 3.43934C20.8927 3.15804 20.5112 3 20.1134 3ZM4.10735 3C3.91037 3 3.71532 3.0388 3.53333 3.11418C3.35134 3.18956 3.18598 3.30005 3.04669 3.43934C2.9074 3.57863 2.79691 3.74399 2.72153 3.92597C2.64615 4.10796 2.60735 4.30302 2.60735 4.5C2.60735 4.69698 2.64615 4.89204 2.72153 5.07403C2.79691 5.25601 2.9074 5.42137 3.04669 5.56066C3.18598 5.69995 3.35134 5.81044 3.53333 5.88582C3.71532 5.9612 3.91037 6 4.10735 6C4.50518 6 4.88671 5.84196 5.16801 5.56066C5.44932 5.27936 5.60735 4.89782 5.60735 4.5C5.60735 4.10218 5.44932 3.72064 5.16801 3.43934C4.88671 3.15804 4.50518 3 4.10735 3Z" fill="white" />
                </svg>
            )
        default:
            break;
    }
}

export default CategoryIcon