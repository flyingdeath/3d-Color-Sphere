/*
 * Copyright 1993-2010 NVIDIA Corporation.  All rights reserved.
 *
 * Please refer to the NVIDIA end user license agreement (EULA) associated
 * with this source code for terms and conditions that govern your use of
 * this software. Any use, reproduction, disclosure, or distribution of
 * this software and related documentation outside the terms of the EULA
 * is strictly prohibited.
 *
 */
 
 /*
 * Copyright 1993-2010 NVIDIA Corporation.  All rights reserved.
 *
 */

#define PI 3.1415926536f
#define BLOCK_SIZE_X 16
#define BLOCK_SIZE_Y 16

cbuffer cbImmutable : register(b0)
{
	uint g_ActualDim;
	uint g_InWidth;
	uint g_OutWidth;
	uint g_OutHeight;
	uint g_DtxAddressOffset;
	uint g_DtyAddressOffset;
};

cbuffer cbChangePerFrame : register(b1)
{
	float g_Time;
	float g_ChoppyScale;
};

StructuredBuffer<float2>	g_InputH0		: register(t0);
StructuredBuffer<float>		g_InputOmega	: register(t1);
RWStructuredBuffer<float2>	g_OutputHt		: register(u0);


//---------------------------------------- Compute Shaders -----------------------------------------

// Pre-FFT data preparation:

// Notice: In CS5.0, we can output up to 8 RWBuffers but in CS4.x only one output buffer is allowed,
// that way we have to allocate one big buffer and manage the offsets manually. The restriction is
// not caused by NVIDIA GPUs and does not present on NVIDIA GPUs when using other computing APIs like
// CUDA and OpenCL.

// H(0) -> H(t)
[numthreads(BLOCK_SIZE_X, BLOCK_SIZE_Y, 1)]
void UpdateSpectrumCS(uint3 DTid : SV_DispatchThreadID)
{
	int in_index = DTid.y * g_InWidth + DTid.x;
	int in_mindex = (g_ActualDim - DTid.y) * g_InWidth + (g_ActualDim - DTid.x);
	int out_index = DTid.y * g_OutWidth + DTid.x;

	// H(0) -> H(t)
	float2 h0_k  = g_InputH0[in_index];
	float2 h0_mk = g_InputH0[in_mindex];
	float sin_v, cos_v;
	sincos(g_InputOmega[in_index] * g_Time, sin_v, cos_v);

	float2 ht;
	ht.x = (h0_k.x + h0_mk.x) * cos_v - (h0_k.y + h0_mk.y) * sin_v;
	ht.y = (h0_k.x - h0_mk.x) * sin_v + (h0_k.y - h0_mk.y) * cos_v;

	// H(t) -> Dx(t), Dy(t)
	float kx = DTid.x - g_ActualDim * 0.5f;
	float ky = DTid.y - g_ActualDim * 0.5f;
	float sqr_k = kx * kx + ky * ky;
	float rsqr_k = 0;
	if (sqr_k > 1e-12f)
		rsqr_k = 1 / sqrt(sqr_k);
	//float rsqr_k = 1 / sqrtf(kx * kx + ky * ky);
	kx *= rsqr_k;
	ky *= rsqr_k;
	float2 dt_x = float2(ht.y * kx, -ht.x * kx);
	float2 dt_y = float2(ht.y * ky, -ht.x * ky);

    if ((DTid.x < g_OutWidth) && (DTid.y < g_OutHeight))
	{
        g_OutputHt[out_index] = ht;
		g_OutputHt[out_index + g_DtxAddressOffset] = dt_x;
		g_OutputHt[out_index + g_DtyAddressOffset] = dt_y;
	}
}
