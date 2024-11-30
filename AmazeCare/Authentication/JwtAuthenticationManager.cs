//using AmazeCare.Models;
//using Microsoft.IdentityModel.Tokens;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//namespace AmazeCare.Authentication
//{
//    public class JwtAuthenticationManager
//    {
//        private readonly string _secretKey;

//        public JwtAuthenticationManager(string secretKey)
//        {
//            _secretKey = secretKey;
//        }

//        public string GenerateToken(string username)
//        {
//            var claims = new[]
//            {
//                new Claim(ClaimTypes.Name, username)
//            };

//            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
//            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//            var token = new JwtSecurityToken(
//                issuer: "AmazeCare",
//                audience: "AmazeCareAudience",
//                claims: claims,
//                expires: DateTime.Now.AddHours(1),
//                signingCredentials: creds
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }
//    }
//}
