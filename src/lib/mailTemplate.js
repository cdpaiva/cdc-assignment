export default function mailTemplate(username, product) {
  return `
  <table width="100%">
    <tbody>
      <tr>
        <td style="padding:0;" role="module-content" height="100%" valign="top">
          <table align="center" width="100%" height="8px" style="line-height:8px; font-size:8px;">
            <tbody>
              <tr>
                <td style="padding:0px 0px 8px 0px;" bgcolor="#000000"></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
  
  <table width="100%">
    <tbody>
      <tr>
        <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top">
            <div>
                <div style="font-family: inherit; text-align: inherit">
                    <span style="font-size: 18px">Hello, ${username},</span>
                </div>
            </div>
        </td>
      </tr>
    </tbody>
  </table>
  
  <table width="100%">
    <tbody>
      <tr>
        <td style="padding:18px 0px 18px 0px; line-height:22px; text-align:inherit; background-color:#FFFFFF;" height="100%" valign="top" bgcolor="#FFFFFF">
        <div>
            <div style="font-family: inherit; text-align: center">You are out of ${product}.</div>
            <div style="font-family: inherit; text-align: center">Log into you Pantry Manager account to check the new items you must buy</div>
        </div>
        </td>
      </tr>
    </tbody>
  </table>`;
}
