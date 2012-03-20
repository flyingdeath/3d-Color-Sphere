
var ocean_simulator_vs = function(){
return "/*\
 * Copyright 1993-2010 NVIDIA Corporation.  All rights reserved.\
 *\
 * Please refer to the NVIDIA end user license agreement (EULA) associated\
 * with this source code for terms and conditions that govern your use of\
 * this software. Any use, reproduction, disclosure, or distribution of\
 * this software and related documentation outside the terms of the EULA\
 * is strictly prohibited.\
 *\
 */\
 \
 //-----------------------------------------------------------------------------\
// Copyright (c) NVIDIA Corporation. All rights reserved.\
//-----------------------------------------------------------------------------\
\
#define PI 3.1415926536f\
#define BLOCK_SIZE_X 16\
#define BLOCK_SIZE_Y 16\
\
\
//---------------------------------------- Vertex Shaders ------------------------------------------\
struct VS_QUAD_OUTPUT\
{\
    float4 Position   : SV_POSITION;  // vertex position\
    float2 TexCoord   : TEXCOORD0;  // vertex texture coords \
};\
\
VS_QUAD_OUTPUT QuadVS(float4 vPos : POSITION)\
{\
  VS_QUAD_OUTPUT Output;\
\
  Output.Position = vPos;\
  Output.TexCoord.x = 0.5f + vPos.x * 0.5f;\
  Output.TexCoord.y = 0.5f - vPos.y * 0.5f;\
\
  return Output;\
}\
\
";

}
